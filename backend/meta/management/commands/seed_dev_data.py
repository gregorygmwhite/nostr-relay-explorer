import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from explorer.models import Relay
from meta.constants import SEED_RELAY_LIST

class Command(BaseCommand):
    help = 'Seed the database'

    def handle(self, *args, **options):
        # Add your seed logic here
        self.create_super_user()
        self.create_relays()
        self.stdout.write(self.style.SUCCESS('Database seeded!'))

    def create_super_user(self):
        superuser_email = "admin@example.com"
        superuser = User.objects.create_superuser(
            username=superuser_email,
            email=superuser_email,
        )
        superuser.set_password('admin')
        superuser.save()

    def create_relays(self):
        for relay in random.sample(SEED_RELAY_LIST, 20):
            new_relay = Relay.objects.create(
                url=relay,
            )
            new_relay.update_metadata()
            self.stdout.write(self.style.SUCCESS('Created relay: ' + relay))
