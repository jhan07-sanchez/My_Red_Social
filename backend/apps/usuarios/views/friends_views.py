from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.usuarios.models import Amistad
from apps.usuarios.serializers import EnviarSolicitudAmistadSerializer, ResponderSolicitudSerializer, ListaAmigosSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.usuarios.models import UserProfile
from django.contrib.auth.models import User
from apps.usuarios.models import FriendRequest, Friendship
from apps.usuarios.serializers import FriendRequestSerializer, FriendshipSerializer




class EnviarSolicitudAmistadView(generics.CreateAPIView):
    """Enviar una solicitud de amistad."""
    serializer_class = EnviarSolicitudAmistadSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario_envia=self.request.user)

class ResponderSolicitudAmistadView(generics.UpdateAPIView):
    """Aceptar o rechazar una solicitud de amistad."""
    serializer_class = ResponderSolicitudSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        solicitud = Amistad.objects.get(pk=pk, usuario_recibe=request.user)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            respuesta = serializer.validated_data['respuesta']
            if respuesta == 'aceptar':
                solicitud.estado = Amistad.ACEPTADA
            elif respuesta == 'rechazar':
                solicitud.estado = Amistad.RECHAZADA

            solicitud.save()
            return Response({'mensaje': f'Solicitud {respuesta} con éxito'}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListaAmigosView(generics.ListAPIView):
    """Lista de amigos del usuario autenticado."""
    serializer_class = ListaAmigosSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Amistad.objects.filter(
            models.Q(usuario_envia=self.request.user, estado=Amistad.ACEPTADA) | 
            models.Q(usuario_recibe=self.request.user, estado=Amistad.ACEPTADA)
        )


class SendFriendRequestView(APIView):
    def post(self, request, username):
        user_to_add = get_object_or_404(User, username=username)
        user_profile = request.user.profile
        friend_profile = user_to_add.profile

        if friend_profile in user_profile.friends.all():
            return Response({'message': 'Ya son amigos'}, status=status.HTTP_400_BAD_REQUEST)

        user_profile.friends.add(friend_profile)
        friend_profile.friends.add(user_profile)

        return Response({'message': 'Solicitud de amistad enviada y aceptada'}, status=status.HTTP_200_OK)

class RemoveFriendView(APIView):
    def post(self, request, username):
        user_to_remove = get_object_or_404(User, username=username)
        user_profile = request.user.profile
        friend_profile = user_to_remove.profile

        if friend_profile in user_profile.friends.all():
            user_profile.friends.remove(friend_profile)
            friend_profile.friends.remove(user_profile)
            return Response({'message': 'Amigo eliminado'}, status=status.HTTP_200_OK)

        return Response({'error': 'No son amigos'}, status=status.HTTP_400_BAD_REQUEST)
    
    
    

class SendFriendRequestView(generics.CreateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        to_user_id = request.data.get('to_user')
        if request.user.id == to_user_id:
            return Response({'error': 'No puedes enviarte una solicitud a ti mismo.'}, status=status.HTTP_400_BAD_REQUEST)
        
        friend_request, created = FriendRequest.objects.get_or_create(
            from_user=request.user,
            to_user_id=to_user_id
        )
        if not created:
            return Response({'error': 'Solicitud de amistad ya enviada.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(FriendRequestSerializer(friend_request).data, status=status.HTTP_201_CREATED)

class AcceptFriendRequestView(generics.UpdateAPIView):
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        friend_request = FriendRequest.objects.get(id=kwargs['pk'])

        if friend_request.to_user != request.user:
            return Response({'error': 'No tienes permiso para aceptar esta solicitud.'}, status=status.HTTP_403_FORBIDDEN)

        friend_request.accepted = True
        friend_request.save()

        # Crear la relación de amistad
        Friendship.objects.create(user=friend_request.from_user, friend=friend_request.to_user)
        Friendship.objects.create(user=friend_request.to_user, friend=friend_request.from_user)

        return Response({'message': 'Solicitud aceptada.'}, status=status.HTTP_200_OK)

class FriendListView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(user=self.request.user)    