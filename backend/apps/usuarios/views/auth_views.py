from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import login, logout
from apps.usuarios.serializers import RegistroSerializer, LoginSerializer, UsuarioSerializer
from apps.usuarios.models import Usuario
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from ..serializers import UsuarioSerializer
from rest_framework_simplejwt.tokens import RefreshToken





class RegistroView(generics.CreateAPIView):
    """Vista para registrar nuevos usuarios."""
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    """Vista para autenticar usuarios y devolver un JWT."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            
            # Generar el token JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            return Response({
                "user": UsuarioSerializer(user).data,
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
    
    


class UsuarioMeView(APIView):
    """Vista para obtener los datos del usuario autenticado"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)    