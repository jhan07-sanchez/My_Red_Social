from django.urls import path
from .views import (
    BuscarUsuariosView,
    EnviarSolicitudAmistadView,
    ResponderSolicitudAmistadView,
    ListaAmigosView,
    SolicitudesPendientesRecibidasView,
    SolicitudesPendientesEnviadasView,
    FriendListView
)

urlpatterns = [
    path('buscar/', BuscarUsuariosView.as_view(), name='buscar-usuarios'),
    path('enviar/', EnviarSolicitudAmistadView.as_view(), name='enviar-solicitud'),
    path('responder/<int:pk>/', ResponderSolicitudAmistadView.as_view(), name='responder-solicitud'),
    path('lista/', ListaAmigosView.as_view(), name='lista-amigos'),
    path('pendientes/recibidas/', SolicitudesPendientesRecibidasView.as_view(), name='solicitudes-recibidas'),
    path('pendientes/enviadas/', SolicitudesPendientesEnviadasView.as_view(), name='solicitudes-enviadas'),
    path('mis-amigos/', FriendListView.as_view(), name='list-friends'),
]
