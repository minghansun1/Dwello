# Generated by Django 5.1.3 on 2024-12-12 23:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("dwello", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="userprofile",
            name="preferred_city",
        ),
        migrations.AddField(
            model_name="userprofile",
            name="city",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="residents",
                to="dwello.city",
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="state",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="residents",
                to="dwello.state",
            ),
        ),
    ]