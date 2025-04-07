from django.db import models
from django.conf import settings

class Publicacion(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='publicaciones')
    contenido = models.TextField(blank=True)
    imagen = models.ImageField(upload_to='publicaciones/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Publicación de {self.usuario.email}"

class Comentario(models.Model):
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='comentarios')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contenido = models.TextField()
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario de {self.usuario.email} en {self.publicacion.id}"

class Reaccion(models.Model):
    TIPOS = (
        ('like', '👍'),
        ('love', '❤️'),
        ('haha', '😂'),
        ('wow', '😮'),
        ('sad', '😢'),
        ('angry', '😡'),
    )
    publicacion = models.ForeignKey(Publicacion, on_delete=models.CASCADE, related_name='reacciones')
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPOS)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('publicacion', 'usuario', 'tipo')  # Para que no reaccione 2 veces igual

    def __str__(self):
        return f"{self.usuario.email} reaccionó con {self.tipo} en publicación {self.publicacion.id}"
 
