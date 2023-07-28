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
        max_length=200,
        validators=[validate_ws_url]
    )

    full_metadata = models.JSONField(
        blank=True,
        null=True,
    )

    pubkey = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    contact = models.EmailField(
        max_length=255,
        blank=True,
        null=True,
    )

    software = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    version = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    description = models.TextField(
        blank=True,
        null=True,
    )

    supported_nips = models.CharField(
        max_length=1048,
        blank=True,
        null=True,
    )

    payment_required = models.BooleanField(
        default=False,
    )

    payments_url = models.URLField(
        max_length=1048,
        blank=True,
        null=True,
    )

    admission_fees_sats = models.IntegerField(
        blank=True,
        null=True,
    )

    publication_fees_sats = models.IntegerField(
        blank=True,
        null=True,
    )

    limitations = models.JSONField(
        blank=True,
        null=True,
    )

    def update_metadata(self):
        """
        Updates the metadata field with the latest metadata from the relay.
        """
        metadata = get_metadata_from_relay_url(self.url)
        self.save_new_metadata(metadata)

    def save_new_metadata(self, metadata):
        name, pubkey, contact, software, version, description = self.deserialize_basic_metadata(metadata)

        self.name = name
        self.pubkey = pubkey
        self.contact = contact
        self.software = software
        self.version = version
        self.description = description

        supported_nips_raw = metadata.get("supported_nips", None)
        if supported_nips_raw:
            self.supported_nips = self.deserialize_supported_nips(supported_nips_raw)

        limitations = metadata.get("limitation", None)
        if limitations:
            self.limitations = limitations

            payment_required_raw = limitations.get("payment_required", None)
            if payment_required_raw:
                payment_required = str(payment_required_raw).lower() == "true"
                self.payment_required = payment_required

        fees_raw = metadata.get("fees", None)
        if fees_raw:
            admission_fees_sats, publication_fees_sats = self.deserialize_fees(fees_raw)
            self.admission_fees_sats = admission_fees_sats
            self.publication_fees_sats = publication_fees_sats

        payments_url = metadata.get("payments_url", None)
        if payments_url:
            self.payments_url = payments_url

        self.full_metadata = metadata
        self.save()

    def deserialize_fees(self, fees_dict):
        admission_fees_sats, publication_fees_sats = None, None
        admission_fees_raw = fees_dict.get("admission", None)
        if admission_fees_raw:
            first_element = admission_fees_raw[0]
            admission_fees_sats = first_element.get("amount", None)


        publication_fees_raw = fees_dict.get("publication", None)
        if publication_fees_raw:
            first_element = publication_fees_raw[0]
            publication_fees_sats = first_element.get("amount", None)

        return admission_fees_sats, publication_fees_sats

    def deserialize_basic_metadata(self, metadata):
        name = metadata.get("name", None)
        pubkey = metadata.get("pubkey", None)
        contact = metadata.get("contact", None)
        software = metadata.get("software", None)
        version = metadata.get("version", None)
        description = metadata.get("description", None)

        return name, pubkey, contact, software, version, description

    def deserialize_supported_nips(self, supported_nips_raw):
        str_list = [str(i) for i in supported_nips_raw]
        return ",".join(str_list)

    def get_supported_nips_list(self):
        str_list = self.supported_nips.split(",")
        return [int(i) for i in str_list]
