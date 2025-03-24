from django.urls import path
from .views import EnviarSolicitudAmistadView, ResponderSolicitudAmistadView, ListaAmigosView
from .views import SendFriendRequestView, RemoveFriendView, AcceptFriendRequestView, FriendListView

urlpatterns = [
    path('enviar/', EnviarSolicitudAmistadView.as_view(), name='enviar-solicitud'),
    path('responder/<int:pk>/', ResponderSolicitudAmistadView.as_view(), name='responder-solicitud'),
    path('lista/', ListaAmigosView.as_view(), name='lista-amigos'),
    path('agregar/<str:username>/', SendFriendRequestView.as_view(), name='add-friend'),
    path('eliminar/<str:username>/', RemoveFriendView.as_view(), name='remove-friend'),
    path('solicitar/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('aceptar/<int:pk>/', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('mis-amigos/', FriendListView.as_view(), name='list-friends'),
]
