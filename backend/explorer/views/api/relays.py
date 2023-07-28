from rest_framework import generics
from explorer.models import Relay
from explorer.serializers import RelaySerializer
from explorer.tasks import update_metadata_for_relay



class RelayListCreateView(generics.ListCreateAPIView):
    queryset = Relay.objects.all()
    serializer_class = RelaySerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        update_metadata_for_relay(instance.id)
