from rest_framework import serializers
from apps.chat.models import Message


class MessageSerializer(serializers.ModelSerializer):
    """Serializador para mensajes entre usuarios."""

    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "content", "timestamp"]
