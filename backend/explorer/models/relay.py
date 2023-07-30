from django.db import models
from django.utils import timezone
from explorer.validators.urls import validate_ws_url
from explorer.utils import get_metadata_from_relay_url
from .nip import NIP
import uuid


class RelayQueryset(models.QuerySet):
    def is_being_tracked(self, is_being_tracked=True):
        return self.filter(
            active_tracking=is_being_tracked,
        )

class RelayManager(models.Manager.from_queryset(
        RelayQueryset,
    )):
    pass

class Relay(models.Model):
    objects = RelayManager()

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

    supported_nips = models.ManyToManyField(
        NIP,
        blank=True,
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

    tracked_since = models.DateTimeField(auto_now_add=True)

    last_metadata_update = models.DateTimeField(
        null=True,
        blank=True,
    )

    last_update_success = models.BooleanField(
        null=True,
        blank=True,
    )

    active_tracking = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return "{} - {} - created: {}".format(self.name, self.url, self.tracked_since)

    def update_metadata(self):
        """
        Updates the metadata field with the latest metadata from the relay.
        """
        try:

            metadata = get_metadata_from_relay_url(self.url)
            self.save_new_metadata(metadata)
        except Exception as e:
            print(f"Failed to fetch metadata from {self.url}. Error: {str(e)}")
            self.last_update_success = False
            self.last_metadata_update = timezone.now()
            self.save()

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
            new_nips = self.deserialize_supported_nips(supported_nips_raw)
            self.supported_nips.clear()
            self.supported_nips.add(*new_nips)

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
        self.last_metadata_update = timezone.now()
        self.last_update_success = True
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
        if contact and contact.startswith('mailto:'):
            contact = contact.replace('mailto:', '', 1)
        software = metadata.get("software", None)
        version = metadata.get("version", None)
        description = metadata.get("description", None)

        return name, pubkey, contact, software, version, description

    def get_supported_nips_list(self):
        nip_list = self.supported_nips.values_list('nip', flat=True)
        return list(nip_list)

    def deserialize_supported_nips(self, supported_nips_raw):
        # Check that all NIPs in the raw data are integers.
        if all(isinstance(nip, int) for nip in supported_nips_raw):
            # Use get_or_create to either fetch the existing NIPs or create new ones.
            return [NIP.objects.get_or_create(nip=nip)[0] for nip in supported_nips_raw]
        else:
            # You may want to raise an exception or handle this case differently.
            raise ValueError("All supported NIPs must be integers.")
