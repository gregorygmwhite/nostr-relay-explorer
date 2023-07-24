from rest_framework import generics
from explorer.models import Relay
from explorer.serializers import RelaySerializer

class RelayListCreateView(generics.ListCreateAPIView):
    queryset = Relay.objects.all()
    serializer_class = RelaySerializer
