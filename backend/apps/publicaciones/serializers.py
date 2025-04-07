from .models import Publicacion, Comentario, Reaccion
from apps.usuarios.serializers import UsuarioSerializer  # usa tu serializador real
from rest_framework import serializers


class ComentarioSerializer(serializers.ModelSerializer):
    autor = UsuarioSerializer(read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'contenido', 'fecha_creacion', 'autor']

class ReaccionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Reaccion
        fields = ['id', 'tipo', 'usuario']

class PublicacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)
    reacciones = ReaccionSerializer(many=True, read_only=True)

    class Meta:
        model = Publicacion
        fields = ['id', 'contenido', 'imagen', 'usuario', 'fecha_creacion', 'comentarios', 'reacciones']
