import re
from rest_framework import serializers
from django.core.exceptions import ValidationError
from explorer.models import Relay

class RelaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Relay
        fields = [
            'id', 'name', 'url', 'full_metadata', 'pubkey', 'contact', 'software',
            'version', 'description', 'supported_nips', 'payment_required',
            'payments_url', 'admission_fees_sats', 'publication_fees_sats',
            'limitations', 'tracked_since', 'last_metadata_update', 'last_update_success'
        ]
        read_only_fields = [
            'id', 'name', 'full_metadata', 'pubkey', 'contact', 'software', 'version',
            'description', 'supported_nips', 'payment_required', 'payments_url',
            'admission_fees_sats', 'publication_fees_sats', 'limitations', 'tracked_since', 'last_metadata_update', 'last_update_success'
        ]

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

    def to_representation(self, instance):
        """ Convert `supported_nips` field back to list in the serialized data. """
        ret = super().to_representation(instance)
        ret['supported_nips'] = instance.get_supported_nips_list()
        return ret
