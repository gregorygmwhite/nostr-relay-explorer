from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from django.utils.translation import gettext_lazy as _

class WSURLValidator(URLValidator):
    schemes = ['http', 'https', 'ftp', 'ftps', 'ws', 'wss']

def validate_ws_url(value):
    validate_url = WSURLValidator()
    try:
        validate_url(value)
    except ValidationError:
        raise ValidationError(_('%(value)s is not a valid URL'), params={'value': value})

def is_valid_ws_url(value):
    try:
        validate_ws_url(value)
        return True
    except ValidationError:
        return False
