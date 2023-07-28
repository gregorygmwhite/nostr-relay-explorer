from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from explorer.models import Relay

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
        relay1 = Relay.objects.create(
            url="wss://relay.damus.io",
            name="Damus",
        )
        relay1.update_metadata()

        relay2 = Relay.objects.create(
            url="wss://nostr.wine",
            name="nostr.wine",
        )
        relay2.update_metadata()
