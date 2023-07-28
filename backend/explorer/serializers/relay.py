import re
from rest_framework import serializers
from django.core.exceptions import ValidationError
from explorer.models import Relay

class RelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Relay
        fields = ['id', 'name', 'url', 'metadata']

    def validate_url(self, value):
        """
        Check that the URL starts with ws:// or wss:// and
        doesn't contain http://, https://, localhost, 127.0.0.1, nor or 0.0.0.0.
        """
        # Check for the valid schemes
        if not re.match(r'^(ws|wss)://', value):
            raise ValidationError('URL must start with ws:// or wss://')

        # Check for the invalid substrings
        invalid_substrings = ['http://', 'https://', 'localhost', '127.0.0.1', '0.0.0.0']
        if any(substring in value for substring in invalid_substrings):
            raise ValidationError('URL must be in the form of wss://relay.something.com or ws://relay.something.com')

        return value
