from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Publicacion
from .serializers import PublicacionSerializer

class PublicacionViewSet(viewsets.ModelViewSet):
    queryset = Publicacion.objects.all().order_by('-fecha_creacion')
    serializer_class = PublicacionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
