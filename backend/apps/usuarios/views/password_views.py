from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import default_token_generator
from apps.usuarios.models import Usuario
from apps.usuarios.utils import enviar_email_recuperacion
from apps.usuarios.serializers import SolicitarRecuperacionSerializer, RestablecerContraseñaSerializer


class SolicitarRecuperacionView(APIView):
    """Solicita un enlace para recuperar la contraseña."""

    def post(self, request):
        serializer = SolicitarRecuperacionSerializer(data=request.data)
        if serializer.is_valid():
            usuario = Usuario.objects.get(email=serializer.validated_data['email'])
            enviar_email_recuperacion(usuario, request)
            return Response({'mensaje': 'Se ha enviado un email con las instrucciones.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RestablecerContraseñaView(APIView):
    """Permite restablecer la contraseña mediante el enlace enviado."""

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            usuario = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response({'error': 'Enlace inválido'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(usuario, token):
            return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RestablecerContraseñaSerializer(data=request.data)
        if serializer.is_valid():
            usuario.set_password(serializer.validated_data['password'])
            usuario.save()
            return Response({'mensaje': 'Contraseña restablecida correctamente.'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
