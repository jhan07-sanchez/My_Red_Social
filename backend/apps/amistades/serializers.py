from rest_framework import serializers
from apps.usuarios.models import Usuario
from apps.amistades.models import Amistad

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["id", "email", "nombre", "foto_perfil"]

class EnviarSolicitudAmistadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistad
        fields = ['usuario_recibe']

    def validate(self, data):
        user_envia = self.context['request'].user
        user_recibe = data['usuario_recibe']

        if user_envia == user_recibe:
            raise serializers.ValidationError("No puedes enviarte una solicitud a ti mismo.")

        if Amistad.objects.filter(usuario_envia=user_envia, usuario_recibe=user_recibe).exists():
            raise serializers.ValidationError("Ya enviaste una solicitud a este usuario.")

        return data


class ResponderSolicitudSerializer(serializers.Serializer):
    respuesta = serializers.ChoiceField(choices=['aceptar', 'rechazar'])

class AmistadSerializer(serializers.ModelSerializer):
    usuario_envia = UsuarioSerializer(read_only=True)
    usuario_recibe = UsuarioSerializer(read_only=True)

    class Meta:
        model = Amistad
        fields = ['id', 'usuario_envia', 'usuario_recibe', 'estado', 'fecha_solicitud']
            