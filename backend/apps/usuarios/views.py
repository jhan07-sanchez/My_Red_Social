from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Usuario
from .serializers import RegistroSerializer, LoginSerializer, UsuarioSerializer

class RegistroView(APIView):
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.save()
            return Response({'mensaje': 'Usuario registrado, revisa tu email'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            usuario = serializer.validated_data['usuario']
            token = RefreshToken.for_user(usuario)
            return Response({'access': str(token.access_token), 'refresh': str(token)})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
