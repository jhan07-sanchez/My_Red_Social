# Generated by Django 5.1.6 on 2025-03-31 00:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Amistad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('aceptada', 'Aceptada'), ('rechazada', 'Rechazada')], default='pendiente', max_length=10)),
                ('fecha_solicitud', models.DateTimeField(auto_now_add=True)),
                ('usuario_envia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='solicitudes_enviadas', to=settings.AUTH_USER_MODEL)),
                ('usuario_recibe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='solicitudes_recibidas', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('usuario_envia', 'usuario_recibe')},
            },
        ),
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friend_of', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friends', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'friend')},
            },
        ),
    ]
