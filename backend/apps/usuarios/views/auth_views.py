from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout
from apps.usuarios.serializers import RegistroSerializer, LoginSerializer, VerificarOTPSerializer, UsuarioSerializer
from apps.usuarios.models import Usuario
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
from apps.usuarios.utils import generar_otp, enviar_codigo_otp
from rest_framework.parsers import MultiPartParser, FormParser





class RegistroView(generics.CreateAPIView):
    """Vista para registrar nuevos usuarios."""
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # El 'is_active' se puede manejar directamente en el serializer
        usuario = serializer.save(is_active=False)  # Crear el usuario desactivado
        usuario.otp = generar_otp()  # Generar OTP
        usuario.otp_created_at = timezone.now()  # Asignar la fecha y hora de creación del OTP
        usuario.save()  # Guardar el usuario con OTP y fecha
        # Enviar el OTP al correo del usuario
        enviar_codigo_otp(usuario)


class LoginView(APIView):
    """Vista para autenticar usuarios y devolver un JWT."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            
            # Generar el token JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                "user": UsuarioSerializer(user, context={"request": request}).data,
                "access_token": access_token,
                "refresh_token": str(refresh)
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Vista para cerrar sesión."""

    def post(self, request):
        logout(request)
        return Response({'mensaje': 'Sesión cerrada correctamente'}, status=status.HTTP_200_OK)


class ActivarCuentaView(APIView):
    """Activa la cuenta de un usuario a través del email de verificación."""

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            usuario = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({'error': 'Enlace inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if default_token_generator.check_token(usuario, token):
            usuario.is_active = True
            usuario.save()
            return Response({'mensaje': 'Cuenta activada correctamente'}, status=status.HTTP_200_OK)

        return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)


class VerificarOTPView(APIView):
    """Verifica el código OTP enviado por correo para activar la cuenta."""
    permission_classes = [AllowAny]
    def post(self, request):
        # Verificar si se enviaron los datos necesarios
        email = request.data.get('email')
        otp = request.data.get('otp')
        print(f"Email recibido: {email}")
        print(f"OTP recibido: {otp}")

        if not email or not otp:
            return Response({"error": "Faltan parámetros: email y otp son requeridos."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar el usuario por el correo
        try:
            usuario = Usuario.objects.get(email=email)
            print(f"OTP almacenado: {usuario.otp}")
            print(f"Fecha de creación del OTP: {usuario.otp_created_at}")
        except Usuario.DoesNotExist:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Imprimir el OTP almacenado en la base de datos para depurar
        print(f"OTP almacenado en la base de datos: {usuario.otp}")
    
        # Verificar que el OTP coincida
        if usuario.otp != otp:
            return Response({"error": "Código OTP incorrecto."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el OTP ha expirado (ej. después de 10 minutos)
        tiempo_expiracion = usuario.otp_created_at + timedelta(minutes=10)
        if timezone.now() > tiempo_expiracion:
            return Response({"error": "El código OTP ha expirado. Solicita uno nuevo."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el OTP es correcto, activar la cuenta del usuario
        usuario.is_active = True
        usuario.otp = None
        usuario.otp_created_at = None
        usuario.save()

        return Response({"mensaje": "Cuenta verificada correctamente."}, status=status.HTTP_200_OK)


class UsuarioMeView(APIView):
    """Vista para obtener los datos del usuario autenticado"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)



class EditarPerfilView(APIView):
    """Vista para editar el perfil del usuario autenticado"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request):
        usuario = request.user
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)