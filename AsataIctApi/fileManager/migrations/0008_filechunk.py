# Generated by Django 4.2.13 on 2024-06-12 05:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fileManager', '0007_alter_userfolders_rootfolderid'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileChunk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chunk', models.FileField(upload_to='file_chunks/')),
                ('chunk_index', models.IntegerField()),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chunks', to='fileManager.file')),
            ],
            options={
                'unique_together': {('file', 'chunk_index')},
            },
        ),
    ]