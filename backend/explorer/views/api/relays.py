import logging
import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError
from django.db.models import Q, F
from django.db import transaction

from explorer.models import Relay
from explorer.serializers import RelaySerializer
from explorer.tasks import update_metadata_for_relay
from explorer.validators import is_valid_ws_url

logger = logging.getLogger(__name__)


class RelayFilter(django_filters.FilterSet):
    url = django_filters.CharFilter(lookup_expr='exact')  # Exact match
    search = django_filters.CharFilter(method='filter_search')
    payment_required = django_filters.BooleanFilter()
    supported_nips = django_filters.CharFilter(method='filter_supported_nips')
    relay_urls = django_filters.CharFilter(method='filter_relay_urls')

    class Meta:
        model = Relay
        fields = [
            'url',
            'payment_required',
            'search',
            'supported_nips',
            'relay_urls',
        ]

    def filter_search(self, queryset, name, value):
        """Custom search filter that looks at the name, pubkey, and url fields."""
        return queryset.filter(
            Q(name__icontains=value) |
            Q(pubkey__icontains=value) |
            Q(url__icontains=value)
        )

    def filter_supported_nips(self, queryset, name, value):
        """Custom filter to filter relays by supported NIPs."""
        # Split the comma-separated string into a list of NIPs.
        nips_list = [int(nip) for nip in value.split(',')]

        # Use the `all` lookup to ensure all NIPs in the list are supported.
        for nip in nips_list:
            queryset = queryset.filter(supported_nips__nip=nip)

        return queryset

    def filter_relay_urls(self, queryset, name, value):
        """Custom filter to filter relays by relay urls."""
        relay_urls_list = [relay_url for relay_url in value.split(',')]

        self._save_new_relays(relay_urls_list)

        return queryset.filter(url__in=relay_urls_list)

    def _save_new_relays(self, relay_urls_list):
        new_relays_to_save = []

        for relay_url in relay_urls_list:
            if (is_valid_ws_url(relay_url) is False):
                logger.error("Invalid relay url: %s", relay_url)
                continue
            try:
                Relay.objects.get(url=relay_url)
            except Relay.DoesNotExist:
                new_relay = Relay(url=relay_url, name=relay_url)
                new_relays_to_save.append(new_relay)

        # Save all the new Relay objects in a single transaction
        with transaction.atomic():
            try:
                Relay.objects.bulk_create(new_relays_to_save)
            except Exception as e:
                logger.error("Failed to create and save new relays: %s", str(e))

            for relay in new_relays_to_save:
                try:
                    relay.refresh_from_db()
                    update_metadata_for_relay(relay.id)
                except Exception as e:
                    logger.error("Failed to schedule metadata update for new relay: %s", str(e))


class RelayListCreateView(generics.ListCreateAPIView):
    queryset = Relay.objects.is_being_tracked()
    serializer_class = RelaySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RelayFilter
    ordering_fields = [
        'name',
        'url'
    ]
    ordering = 'name'

    def get_queryset(self):
        queryset = super().get_queryset()
        ordering = self.request.query_params.get('ordering', self.ordering)

        if ordering not in self.ordering_fields:
            ordering = self.ordering

        queryset = queryset.order_by(F(ordering).asc(nulls_last=True))

        return queryset


    def perform_create(self, serializer):
        url = serializer.validated_data.get('url', None)
        name = serializer.validated_data.get('name', "")
        if url and name == "":
            # Assign url value to name
            serializer.validated_data['name'] = url

        with transaction.atomic():
            try:
                instance = serializer.save()
                instance.update_metadata()
            except Exception as e:
                raise ValidationError("Failed to query and save metadata for relay: {}".format(e))


class RelayRetrieveView(generics.RetrieveAPIView):
    lookup_field = 'id'
    queryset = Relay.objects.is_being_tracked()
    serializer_class = RelaySerializer
