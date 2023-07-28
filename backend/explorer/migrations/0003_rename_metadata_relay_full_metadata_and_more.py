# Generated by Django 4.2.3 on 2023-07-28 04:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('explorer', '0002_alter_relay_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='relay',
            old_name='metadata',
            new_name='full_metadata',
        ),
        migrations.AddField(
            model_name='relay',
            name='admission_fees_sats',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='contact',
            field=models.EmailField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='limitations',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='payment_required',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='relay',
            name='payments_url',
            field=models.URLField(blank=True, max_length=1048, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='pubkey',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='publication_fees_sats',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='software',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='supported_nips',
            field=models.CharField(blank=True, max_length=1048, null=True),
        ),
        migrations.AddField(
            model_name='relay',
            name='version',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
