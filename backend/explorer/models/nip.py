from django.db import models

class NIP(models.Model):
    nip = models.IntegerField(unique=True)

    def __str__(self):
        return "NIP: {}".format(self.nip)
