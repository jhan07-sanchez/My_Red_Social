from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Publicacion(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name="publicaciones")
    contenido = models.TextField()
    imagen = models.ImageField(upload_to="publicaciones/", blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.usuario.username} - {self.fecha_creacion.strftime('%Y-%m-%d %H:%M')}"
