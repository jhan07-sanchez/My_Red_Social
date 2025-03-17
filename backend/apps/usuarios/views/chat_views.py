from rest_framework import generics, permissions
from apps.usuarios.models import Message
from apps.usuarios.serializers import MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friend_id = self.kwargs['friend_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(receiver_id=friend_id)) | 
            (Q(sender_id=friend_id) & Q(receiver=user))
        ).order_by('timestamp')




class ListMessagesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_user_id = self.kwargs['user_id']

        return Message.objects.filter(
            (models.Q(sender=user) & models.Q(receiver_id=other_user_id)) |
            (models.Q(sender_id=other_user_id) & models.Q(receiver=user))
        ).order_by('timestamp')

class MarkAsReadView(generics.UpdateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        message = Message.objects.get(id=kwargs['pk'])
        if message.receiver != request.user:
            return Response({'error': 'No puedes marcar como leído este mensaje.'}, status=status.HTTP_403_FORBIDDEN)

        message.is_read = True
        message.save()

        return Response(MessageSerializer(message).data, status=status.HTTP_200_OK)