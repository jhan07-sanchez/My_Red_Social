# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.publicaciones.models import Publicacion, Comentario, Reaccion
from apps.publicaciones.serializers import  (
    PublicacionSerializer,
    ComentarioSerializer,
    ReaccionSerializer,
)

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all().order_by('-fecha_creacion')
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}  # 🔥 importante

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    @action(detail=True, methods=['post'])
    def comentar(self, request, pk=None):
        publicacion = self.get_object()
        serializer = ComentarioSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(publicacion=publicacion, autor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reaccionar(self, request, pk=None):
        publicacion = self.get_object()
        tipo = request.data.get('tipo', 'like')
        reaccion = Reaccion.objects.create(
            publicacion=publicacion,
            usuario=request.user,
            tipo=tipo
        )
        serializer = ReaccionSerializer(reaccion, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ComentarioViewSet(viewsets.ModelViewSet):
    queryset = Comentario.objects.all().order_by('-fecha_creacion')
    serializer_class = ComentarioSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

class ReaccionViewSet(viewsets.ModelViewSet):
    queryset = Reaccion.objects.all()
    serializer_class = ReaccionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)  # <-- este campo debe ser `usuario` si así se llama
