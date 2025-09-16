from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.usuarios.models import Usuario
from apps.usuarios.utils import generar_otp
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializador para el modelo de usuario."""

    foto_perfil_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'foto_perfil', 'foto_perfil_url', 'biografia']
        read_only_fields = ['id']

    def get_foto_perfil_url(self, obj):
        request = self.context.get('request')
        base_url = "http://192.168.101.7:8090"
        if request:
            if obj.foto_perfil:
                return request.build_absolute_uri(obj.foto_perfil.url)
            return request.build_absolute_uri('/media/imagenes/default-avatar.png')
        else:
            if obj.foto_perfil:
                return f"{base_url}{obj.foto_perfil.url}"
        return f"{base_url}/media/imagenes/default-avatar.png"

    def create(self, validated_data):
        email = validated_data.pop('email', None)  # Asegúrate de que solo se pase el email una vez
        user = Usuario.objects.create_user(**validated_data)  # Usa create_user para crear el usuario
        if email:
            user.email = email
            user.save()
        return user

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

    def validate_email(self, value):
        """Valida que el email no esté ya registrado como un usuario activo."""
        usuario_existente = Usuario.objects.filter(email=value).first()
        if usuario_existente and usuario_existente.is_active:
            raise serializers.ValidationError("Ya existe un usuario registrado con este correo.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data.pop('password2')

        # Comprobar si el usuario ya existe pero está desactivado
        email = validated_data.get('email')
        usuario = Usuario.objects.filter(email=email, is_active=False).first()

        if usuario:
            # Si el usuario existe pero está desactivado, actualizamos sus datos
            usuario.nombre = validated_data.get('nombre', usuario.nombre)
            usuario.set_password(password)
        else:
            # Si el usuario no existe, creamos uno nuevo
            usuario = Usuario(**validated_data)  # Aquí no es necesario pasar 'email' explícitamente

        # Desactivar usuario y generar OTP
        usuario.set_password(password)  # Garantizar que la contraseña se setee correctamente
        usuario.is_active = False
        usuario.otp = generar_otp()
        usuario.otp_created_at = timezone.now()
        usuario.save()

        # Enviar correo de verificación
        send_mail(
            subject="Verifica tu cuenta",
            message=f"Tu código de verificación es: {usuario.otp}",
            from_email="noreply@tuapp.com",
            recipient_list=[usuario.email],
            fail_silently=False
        )

        return usuario

class LoginSerializer(serializers.Serializer):
    """Serializador para autenticación de usuarios."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        print("Datos recibidos para login:", data)  #  imprime datos
        user = authenticate(request=self.context.get('request'), email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Credenciales inválidas')
        if not user.is_active:
            raise serializers.ValidationError('Cuenta desactivada')

        data['user'] = user
        return data


class VerificarOTPSerializer(serializers.Serializer):
    """Verifica el código OTP enviado por correo para activar la cuenta."""

    email = serializers.EmailField()
    otp = serializers.CharField()

    def validate(self, data):
        # Obtén el usuario que corresponde al email
        usuario = Usuario.objects.filter(email=data['email']).first()

        # Verifica si el usuario existe
        if not usuario:
            raise serializers.ValidationError("Usuario no encontrado.")

        # Verifica que el OTP coincida
        if usuario.otp != data['otp']:
            raise serializers.ValidationError("Código OTP inválido.")

        # Verificación de tiempo de expiración del OTP
        tiempo_expiracion = timezone.now() - timedelta(minutes=10)
        if usuario.otp_created_at < tiempo_expiracion:
            raise serializers.ValidationError("El código OTP ha expirado.")

        return data

    def save(self):
        # Obtén el usuario nuevamente con el email
        usuario = Usuario.objects.get(email=self.validated_data['email'])

        # Activar la cuenta y limpiar los datos del OTP
        usuario.is_active = True
        usuario.otp = None
        usuario.otp_created_at = None
        usuario.save()

        return usuario