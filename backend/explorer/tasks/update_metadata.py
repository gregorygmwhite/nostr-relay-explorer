from explorer.models import Relay
from huey import crontab
from huey.contrib import djhuey

@djhuey.db_periodic_task(
    crontab(
        # Every 00:00 UTC
        minute="0",
        hour="0",
    )
)
def update_metadata_for_all_relays():
    relays = Relay.objects.is_actively_being_tracked()
    for relay in relays:
        update_metadata_for_relay(relay)

@djhuey.db_task()
def update_metadata_for_relay(relay_id):
    relay = Relay.objects.get(id=relay_id)
    relay.update_metadata()
