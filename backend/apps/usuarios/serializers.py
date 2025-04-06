from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.usuarios.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    """Serializador para el modelo de usuario."""

    foto_perfil_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'foto_perfil_url', 'biografia']
        read_only_fields = ['id']

    def get_foto_perfil_url(self, obj):
        print(self.context)
        request = self.context.get('request')
        base_url = "http://192.168.101.7:8000"
        if request:
            if obj.foto_perfil:
                return request.build_absolute_uri(obj.foto_perfil.url)
            return request.build_absolute_uri('/media/imagenes/default-avatar.png')
        else:
            # En caso de que no haya request, devuelve la ruta relativa (opcional)
            if obj.foto_perfil:
                 return f"{base_url}{obj.foto_perfil.url}"
        return f"{base_url}/media/imagenes/default-avatar.png"
    
    
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
        password = validated_data.pop('password')
        validated_data.pop('password2')
        usuario = Usuario.objects.create_user(password=password, **validated_data)
        return usuario

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
