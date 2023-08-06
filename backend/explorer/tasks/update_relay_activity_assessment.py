import websocket
import logging
import time
import uuid
import json
import ssl

from nostr.filter import Filter, Filters
from nostr.relay_manager import RelayManager
from nostr.message_type import ClientMessageType

from huey import crontab
from huey.contrib import djhuey

from explorer.models import Relay

logger = logging.getLogger(__name__)

@djhuey.db_periodic_task(
    crontab(
        # Twice a day (every 12 hours)
        minute="0",
        hour="*/12",
    )
)
def update_activity_assessment_for_all_relays():
    relays = Relay.objects.all()
    for relay in relays:
        try:
            _update_relay_activity_assessment_for_relay(relay)
        except Exception as e:
            print("Failed to update activity assessment for relay {}".format(relay.url), str(e))


@djhuey.db_task()
def update_relay_activity_assessment_for_relay(relay_id):
    try:
        relay = Relay.objects.get(id=relay_id)
        _update_relay_activity_assessment_for_relay(relay)

    except Exception as e:
        print("Failed to update activity assessment for relay {}".format(relay.url), str(e))
        raise e

def _update_relay_activity_assessment_for_relay(relay):
    filters = Filters([Filter(kinds=[9735], limit=300)]) # zap receipts
    subscription_id = uuid.uuid1().hex
    request = [ClientMessageType.REQUEST, subscription_id]
    request.extend(filters.to_json_array())

    relay_manager = RelayManager()
    print("Adding relay manager:", relay.url)
    relay_manager.add_relay(relay.url)

    relay_manager.add_subscription(subscription_id, filters)

    try:
        relay_manager.open_connections({"cert_reqs": ssl.CERT_NONE})
        time.sleep(2)
        message = json.dumps(request)
        relay_manager.publish_message(message)
        time.sleep(1) # allow the messages to send
    except websocket._exceptions.WebSocketConnectionClosedException as e:
        logger.error("WebSocket connection was closed: %s", e)

    events = []
    while relay_manager.message_pool.has_events():
        event_msg = relay_manager.message_pool.get_event()
        events.append(event_msg.event)

    relay_manager.close_connections()

    if len(events) <100:
        print("Not enough events {} for relay {}".format(len(events), relay.url))
        relay.activity_assessment = None
        relay.save()
        return

    print("Updating activity assessment for relay", relay.url)
    earliest_event = events[0].created_at
    latest_event = events[0].created_at
    for event in events:
        if event.created_at < earliest_event:
            earliest_event = event.created_at
        if event.created_at > latest_event:
            latest_event = event.created_at

    now_epoch = int(time.time())
    if latest_event < (now_epoch - 86400):
        print("Latest event is more than 24 hours old for relay {}".format(relay.url))
        relay.activity_assessment = None
        relay.save()
        return

    activity_assessment = latest_event - earliest_event
    relay.activity_assessment = activity_assessment
    relay.save()

    return activity_assessment



