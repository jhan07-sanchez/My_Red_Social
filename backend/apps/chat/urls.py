from django.urls import path
from .views import SendMessageView, ChatHistoryView

urlpatterns = [
    path('enviar/', SendMessageView.as_view(), name='send-message'),
    path('historial/<int:friend_id>/', ChatHistoryView.as_view(), name='chat-history'),
]
