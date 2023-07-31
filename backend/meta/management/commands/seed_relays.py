import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from explorer.models import Relay
from meta.constants import SEED_RELAY_LIST

class Command(BaseCommand):
    help = 'Seed the database with relays'

    def handle(self, *args, **options):
        self.create_relays()
        self.stdout.write(self.style.SUCCESS('Relay list seeded!'))

    def create_relays(self):
        for relay in SEED_RELAY_LIST:
            new_relay = Relay.objects.create(
                url=relay,
            )
            new_relay.update_metadata()
            self.stdout.write(self.style.SUCCESS('Created relay: ' + relay))
