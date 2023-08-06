import logging
import time
import uuid

from pynostr.relay_manager import RelayManager
from pynostr.filters import FiltersList, Filters
from pynostr.event import EventKind

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
    _update_relay_acitivty_assessment_for_relays(relays)


def _update_relay_acitivty_assessment_for_relays(relays):
    relay_manager = RelayManager(timeout=2)

    events = {}

    for relay in relays:
        relay_manager.add_relay(relay.url)

    filters = FiltersList([Filters(kinds=[9735], limit=300)]) # zap receipts
    subscription_id = uuid.uuid1().hex
    relay_manager.add_subscription_on_all_relays(subscription_id, filters)
    relay_manager.run_sync()
    while relay_manager.message_pool.has_notices():
        relay_manager.message_pool.get_notice()

    while relay_manager.message_pool.has_events():
        event_msg = relay_manager.message_pool.get_event()
        events.get(event_msg.url, []).append(event_msg.event)

    relay_manager.close_all_relay_connections()

    for relay_url, events in events.items():
        try:
            _update_relay_activity_assessment_from_events(events, relay_url)
        except Exception as e:
            logger.error("Failed to update activity assessment for relay %s: %s", relay_url, str(e))


def _update_relay_activity_assessment_from_events(events, relay_url):
    if len(events) <50:
        return

    relay = Relay.objects.get(url=relay_url)
    earliest_event = events[0].created_at
    latest_event = events[0].created_at
    for event in events:
        if event.created_at < earliest_event:
            earliest_event = event.created_at
        if event.created_at > latest_event:
            latest_event = event.created_at

    relay.activity_assessment = latest_event - earliest_event
    relay.save()
