from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),  # Agrega esta línea
    path('api/usuario/', include('apps.usuarios.urls')),
]


