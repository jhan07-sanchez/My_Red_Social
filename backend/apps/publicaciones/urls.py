# urls.py de la app publicaciones
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.views import PublicacionViewSet, ComentarioViewSet, ReaccionViewSet

router = DefaultRouter()
router.register(r'publicaciones', PublicacionViewSet, basename='publicacion')
router.register(r'comentarios', ComentarioViewSet, basename='comentarios')
router.register(r'reacciones', ReaccionViewSet, basename='reacciones')

urlpatterns = [
    path('', include(router.urls)),
]
