import django_filters
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from explorer.models import Relay
from explorer.serializers import RelaySerializer
from explorer.tasks import update_metadata_for_relay


class RelayFilter(django_filters.FilterSet):
    url = django_filters.CharFilter(lookup_expr='exact')  # Exact match
    search = django_filters.CharFilter(method='filter_search')
    payment_required = django_filters.BooleanFilter()
    supported_nips = django_filters.CharFilter(method='filter_supported_nips')  # Custom NIPs filter

    class Meta:
        model = Relay
        fields = [
            'url',
            'payment_required',
            'search',
            'supported_nips'
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


class RelayListCreateView(generics.ListCreateAPIView):
    queryset = Relay.objects.is_being_tracked()
    serializer_class = RelaySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RelayFilter

    def perform_create(self, serializer):
        instance = serializer.save()
        update_metadata_for_relay(instance.id)


class RelayRetrieveView(generics.RetrieveAPIView):
    lookup_field = 'id'
    queryset = Relay.objects.is_being_tracked()
    serializer_class = RelaySerializer
