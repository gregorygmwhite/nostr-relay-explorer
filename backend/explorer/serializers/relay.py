from rest_framework import serializers
from explorer.models import Relay

class RelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Relay
        fields = ['id', 'name', 'url', 'metadata']
