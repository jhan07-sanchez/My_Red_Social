from rest_framework import serializers
from apps.usuarios.models import Usuario
from apps.amistades.models import Amistad, Friendship

class EnviarSolicitudAmistadSerializer(serializers.ModelSerializer):
    """Serializador para enviar una solicitud de amistad."""

    class Meta:
        model = Amistad
        fields = ['usuario_recibe']

class ResponderSolicitudSerializer(serializers.Serializer):
    """Serializador para responder a una solicitud de amistad."""
    respuesta = serializers.ChoiceField(choices=['aceptar', 'rechazar'])

class ListaAmigosSerializer(serializers.ModelSerializer):
    """Serializador para listar amigos de un usuario."""

    usuario_envia = serializers.StringRelatedField()
    usuario_recibe = serializers.StringRelatedField()

    class Meta:
        model = Amistad
        fields = ['usuario_envia', 'usuario_recibe', 'estado']

class FriendshipSerializer(serializers.ModelSerializer):
    """Serializador para relaciones de amistad."""

    class Meta:
        model = Amistad
        fields = '__all__'



class FriendRequestSerializer(serializers.ModelSerializer):
    """Serializador para solicitudes de amistad."""

    class Meta:
        model = Amistad  # Asegúrate de que el modelo sea correcto
        fields = '__all__'