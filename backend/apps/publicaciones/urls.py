from django.urls import path
from apps.publicaciones.views.views import publicaciones

urlpatterns = [
    path("", publicaciones, name="publicaciones"),
]
