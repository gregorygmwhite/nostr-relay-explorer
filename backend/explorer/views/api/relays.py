from rest_framework import generics
from explorer.models import Relay
from explorer.serializers import RelaySerializer
from explorer.utils import get_metadata_from_relay_url



class RelayListCreateView(generics.ListCreateAPIView):
    queryset = Relay.objects.all()
    serializer_class = RelaySerializer

    def perform_create(self, serializer):
        relay_url = serializer.validated_data["url"]

        # turn relay url using the wss or ws protocol into http or https
        metadata = get_metadata_from_relay_url(relay_url)

        # Save the relay with the fetched metadata
        serializer.save(metadata=metadata)
