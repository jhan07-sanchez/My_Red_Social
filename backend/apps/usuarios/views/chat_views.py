from rest_framework import generics, permissions
from apps.usuarios.models import Message
from apps.usuarios.serializers import MessageSerializer


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
