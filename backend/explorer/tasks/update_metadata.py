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
    relays = Relay.objects.all()
    for relay in relays:
        relay.update_metadata()
