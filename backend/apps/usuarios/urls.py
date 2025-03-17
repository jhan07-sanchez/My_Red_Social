from django.urls import path
from .views.auth_views import RegistroView, LoginView, LogoutView, ActivarCuentaView
from .views.password_views import SolicitarRecuperacionView
from apps.usuarios.views.password_views import RestablecerContraseñaView
from .views.friends_views import EnviarSolicitudAmistadView, ResponderSolicitudAmistadView, ListaAmigosView, SendFriendRequestView, RemoveFriendView, SendFriendRequestView, AcceptFriendRequestView, FriendListView
from .views.follow_views import FollowUserView
from .views.chat_views import SendMessageView, ChatHistoryView



urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activar/<uidb64>/<token>/', ActivarCuentaView.as_view(), name='activar-cuenta'),
    path('recuperar/', SolicitarRecuperacionView.as_view(), name='solicitar-recuperacion'),
    path('recuperar/<uidb64>/<token>/', RestablecerContraseñaView.as_view(), name='reset-password'),
    path('amigos/enviar/', EnviarSolicitudAmistadView.as_view(), name='enviar-solicitud'),
    path('amigos/responder/<int:pk>/', ResponderSolicitudAmistadView.as_view(), name='responder-solicitud'),
    path('amigos/', ListaAmigosView.as_view(), name='lista-amigos'),
    path('follow/<str:username>/', FollowUserView.as_view(), name='follow-user'),
    path('add-friend/<str:username>/', SendFriendRequestView.as_view(), name='add-friend'),
    path('remove-friend/<str:username>/', RemoveFriendView.as_view(), name='remove-friend'),
    path('send-message/', SendMessageView.as_view(), name='send-message'),
    path('chat/<int:friend_id>/', ChatHistoryView.as_view(), name='chat-history'),
    path('send-friend-request/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('accept-friend-request/<int:pk>/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('list-friends/', FriendListView.as_view(), name='list-friends'),
]