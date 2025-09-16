from .models import Publicacion, Comentario, Reaccion
from apps.usuarios.serializers import UsuarioSerializer
from rest_framework import serializers


class ComentarioSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Comentario
        fields = ['id', 'contenido', 'fecha_creacion', 'usuario', 'publicacion']
        read_only_fields = ['usuario', 'fecha_creacion', 'publicacion']


class ReaccionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Reaccion
        fields = ['id', 'tipo', 'usuario', 'publicacion', 'fecha_creacion']
        read_only_fields = ['usuario', 'fecha_creacion']

    def create(self, validated_data):
        usuario = self.context['request'].user
        publicacion = validated_data['publicacion']
        tipo = validated_data['tipo']

        reaccion, creada = Reaccion.objects.update_or_create(
            usuario=usuario,
            publicacion=publicacion,
            tipo=tipo,
            defaults={'fecha_creacion': validated_data.get('fecha_creacion')}
        )
        return reaccion


class PublicacionSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    comentarios = ComentarioSerializer(many=True, read_only=True)
    reacciones = ReaccionSerializer(many=True, read_only=True)

    class Meta:
        model = Publicacion
        fields = ['id', 'contenido', 'imagen', 'usuario', 'fecha_creacion', 'comentarios', 'reacciones']
