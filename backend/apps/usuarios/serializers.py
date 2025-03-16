from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.usuarios.models import Usuario, Amistad, UserProfile
from apps.usuarios.models import Message
from .models import FriendRequest, Friendship




class UsuarioSerializer(serializers.ModelSerializer):
    """Serializador para el modelo de usuario."""

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'foto_perfil', 'biografia']
        read_only_fields = ['id']

class RegistroSerializer(serializers.ModelSerializer):
    """Serializador para registrar nuevos usuarios."""

    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ['email', 'nombre', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        """Verifica que las contraseñas coincidan."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return data

    def create(self, validated_data):
        """Crea un nuevo usuario."""
        validated_data.pop('password2')
        return Usuario.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    """Serializador para autenticación de usuarios."""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Autentica al usuario."""
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Credenciales inválidas')
        if not user.is_active:
            raise serializers.ValidationError('Cuenta desactivada')
        return user



class SolicitarRecuperacionSerializer(serializers.Serializer):
    """Serializador para solicitar recuperación de contraseña."""
    email = serializers.EmailField()

    def validate_email(self, email):
        """Verifica si el email está registrado."""
        if not Usuario.objects.filter(email=email, is_active=True).exists():
            raise serializers.ValidationError("No existe un usuario con este email.")
        return email


class RestablecerContraseñaSerializer(serializers.Serializer):
    """Serializador para restablecer la contraseña."""
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        """Verifica que las contraseñas coincidan."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden'})
        return data




class EnviarSolicitudAmistadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Amistad
        fields = ['usuario_recibe']

class ResponderSolicitudSerializer(serializers.Serializer):
    respuesta = serializers.ChoiceField(choices=['aceptar', 'rechazar'])

class ListaAmigosSerializer(serializers.ModelSerializer):
    usuario_envia = UsuarioSerializer(read_only=True)
    usuario_recibe = UsuarioSerializer(read_only=True)

    class Meta:
        model = Amistad
        fields = ['usuario_envia', 'usuario_recibe', 'estado']



class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['followers']
        

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['friends']
        


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']
        



class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = '__all__'        