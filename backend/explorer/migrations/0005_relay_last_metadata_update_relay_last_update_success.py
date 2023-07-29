# Generated by Django 4.2.3 on 2023-07-28 05:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('explorer', '0004_relay_active_tracking_relay_tracked_since'),
    ]

    operations = [
        migrations.AddField(
            model_name='relay',
            name='last_metadata_update',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='last_update_success',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]