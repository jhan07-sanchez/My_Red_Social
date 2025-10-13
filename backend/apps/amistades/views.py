from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from apps.usuarios.models import Usuario
from apps.amistades.models import Amistad
from .serializers import (
    EnviarSolicitudAmistadSerializer, 
    ResponderSolicitudSerializer, 
    AmistadSerializer, 
    UsuarioSerializer
)

# 🔍 Buscar usuarios por nombre
class BuscarUsuariosView(generics.ListAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        q = self.request.query_params.get("q", "")
        return Usuario.objects.filter(nombre__icontains=q).exclude(id=self.request.user.id)


# 📤 Enviar solicitud de amistad
class EnviarSolicitudAmistadView(generics.CreateAPIView):
    serializer_class = EnviarSolicitudAmistadSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario_envia=self.request.user)


# ✅ Responder solicitud (aceptar/rechazar)
class ResponderSolicitudAmistadView(generics.UpdateAPIView):
    serializer_class = ResponderSolicitudSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        solicitud = get_object_or_404(Amistad, pk=kwargs["pk"], usuario_recibe=request.user)
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if serializer.validated_data['respuesta'] == 'aceptar':
                solicitud.estado = Amistad.ACEPTADA
            else:
                solicitud.estado = Amistad.RECHAZADA
            solicitud.save()
            return Response({'mensaje': f'Solicitud {solicitud.estado} con éxito'})
        
        return Response(serializer.errors, status=400)



# 👫 Lista de amigos confirmados
class ListaAmigosView(generics.ListAPIView):
    serializer_class = AmistadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Amistad.objects.filter(
            Q(usuario_envia=self.request.user, estado=Amistad.ACEPTADA) |
            Q(usuario_recibe=self.request.user, estado=Amistad.ACEPTADA)
        )


# ⏳ Ver solicitudes pendientes recibidas
class SolicitudesPendientesRecibidasView(generics.ListAPIView):
    serializer_class = AmistadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Amistad.objects.filter(usuario_recibe=self.request.user, estado=Amistad.SOLICITUD_PENDIENTE)


# ⏳ Ver solicitudes pendientes enviadas
class SolicitudesPendientesEnviadasView(generics.ListAPIView):
    serializer_class = AmistadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Amistad.objects.filter(usuario_envia=self.request.user, estado=Amistad.SOLICITUD_PENDIENTE)



class FriendListView(generics.ListAPIView):
    """Listar amigos del usuario autenticado."""
    serializer_class = AmistadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Amistad.objects.filter(
            Q(usuario_envia=self.request.user, estado=Amistad.ACEPTADA) |
            Q(usuario_recibe=self.request.user, estado=Amistad.ACEPTADA)
        )