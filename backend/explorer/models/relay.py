from django.db import models
from explorer.validators.urls import validate_ws_url
from explorer.utils import get_metadata_from_relay_url
import uuid

class Relay(models.Model):
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        default=uuid.uuid4,
    )

    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    url = models.CharField(
        max_length=200, validators=[validate_ws_url]
    )

    metadata = models.JSONField(
        blank=True,
        null=True,
    )

    def update_metadata(self):
        """
        Updates the metadata field with the latest metadata from the relay.
        """
        self.metadata = get_metadata_from_relay_url(self.url)
        self.save()

