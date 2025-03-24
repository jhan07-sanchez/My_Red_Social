from rest_framework import generics, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from apps.chat.models import Message
from apps.chat.serializers import MessageSerializer

class SendMessageView(generics.CreateAPIView):
    """Vista para enviar mensajes"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class ChatHistoryView(generics.ListAPIView):
    """Vista para obtener el historial de mensajes entre el usuario autenticado y un amigo"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friend_id = self.kwargs['friend_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(receiver_id=friend_id)) | 
            (Q(sender_id=friend_id) & Q(receiver=user))
        ).order_by('timestamp')


class ListMessagesView(generics.ListAPIView):
    """Vista para listar los mensajes entre el usuario autenticado y otro usuario"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs['user_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(receiver_id=other_user_id)) |
            (Q(sender_id=other_user_id) & Q(receiver=user))
        ).order_by('timestamp')


class MarkAsReadView(generics.UpdateAPIView):
    """Vista para marcar un mensaje como leído"""
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        try:
            message = Message.objects.get(id=kwargs['pk'])
            if message.receiver != request.user:
                return Response({'error': 'No puedes marcar como leído este mensaje.'}, status=status.HTTP_403_FORBIDDEN)

            message.is_read = True
            message.save()
            return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)
        
        except Message.DoesNotExist:
            return Response({'error': 'Mensaje no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
