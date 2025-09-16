# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from apps.amistades.models import Amistad
from django.db.models import Q

from apps.publicaciones.models import Publicacion, Comentario, Reaccion
from apps.publicaciones.serializers import (
    PublicacionSerializer,
    ComentarioSerializer,
    ReaccionSerializer,
)

# publicaciones/views.py


class PublicacionViewSet(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # ✅ Publicaciones propias
        publicaciones_propias = Publicacion.objects.filter(usuario=user)

        # ✅ Buscar amigos (donde el usuario sea el que envió o recibió la solicitud y esté aceptada)
        amigos_ids = Amistad.objects.filter(
            Q(usuario_envia=user, estado=Amistad.ACEPTADA)
            | Q(usuario_recibe=user, estado=Amistad.ACEPTADA)
        ).values_list("usuario_envia_id", "usuario_recibe_id")

        # Convertimos los pares en una lista de IDs (excluyendo el propio user.id)
        amigos_ids = set([id for tupla in amigos_ids for id in tupla if id != user.id])

        # ✅ Publicaciones de amigos con privacidad "amigos"
        publicaciones_amigos = Publicacion.objects.filter(
            usuario__id__in=amigos_ids, privacidad="amigos"
        )

        # ✅ Publicaciones públicas de cualquiera
        publicaciones_publicas = Publicacion.objects.filter(privacidad="publica")

        # 🔥 Unimos todo
        return (
            (publicaciones_propias | publicaciones_amigos | publicaciones_publicas)
            .distinct()
            .order_by("-fecha_creacion")
        )

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=["post"])
    def comentar(self, request, pk=None):
        publicacion = self.get_object()
        serializer = ComentarioSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save(publicacion=publicacion, autor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def reaccionar(self, request, pk=None):
        publicacion = self.get_object()
        tipo = request.data.get("tipo", "like")
        reaccion = Reaccion.objects.create(
            publicacion=publicacion, usuario=request.user, tipo=tipo
        )
        serializer = ReaccionSerializer(reaccion, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ComentarioViewSet(viewsets.ModelViewSet):
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        publicacion_id = self.request.query_params.get("publicacion")
        if publicacion_id:
            return Comentario.objects.filter(publicacion_id=publicacion_id).order_by(
                "-fecha_creacion"
            )
        return Comentario.objects.all().order_by("-fecha_creacion")

    @action(detail=True, methods=["post"], url_path="comentar")
    def comentar(self, request, pk=None):
        try:
            publicacion = Publicacion.objects.get(pk=pk)
        except Publicacion.DoesNotExist:
            return Response(
                {"publicacion": "No existe una publicación con ese ID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(usuario=request.user, publicacion=publicacion)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReaccionViewSet(viewsets.ModelViewSet):
    queryset = Reaccion.objects.all()
    serializer_class = ReaccionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def get_queryset(self):
        return Reaccion.objects.filter(usuario=self.request.user)
