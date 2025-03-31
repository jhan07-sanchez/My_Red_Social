from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/usuarios/', include('apps.usuarios.urls')),  # Agregar la API de usuarios
    path('api/amistades/', include('apps.amistades.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path("api/publicaciones/", include("apps.publicaciones.urls")),
]


