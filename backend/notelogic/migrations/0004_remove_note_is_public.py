# Generated by Django 5.1.5 on 2025-02-23 10:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("notelogic", "0003_note_is_public_alter_note_content"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="note",
            name="is_public",
        ),
    ]
