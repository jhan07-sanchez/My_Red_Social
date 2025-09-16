from django.db import models
from django.conf import settings

class Amistad(models.Model):
    SOLICITUD_PENDIENTE = 'pendiente'
    ACEPTADA = 'aceptada'
    RECHAZADA = 'rechazada'

    ESTADOS_SOLICITUD = [
        (SOLICITUD_PENDIENTE, 'Pendiente'),
        (ACEPTADA, 'Aceptada'),
        (RECHAZADA, 'Rechazada'),
    ]

    usuario_envia = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='solicitudes_enviadas', on_delete=models.CASCADE)
    usuario_recibe = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='solicitudes_recibidas', on_delete=models.CASCADE)
    estado = models.CharField(max_length=10, choices=ESTADOS_SOLICITUD, default=SOLICITUD_PENDIENTE)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario_envia', 'usuario_recibe')

    def __str__(self):
        return f'{self.usuario_envia} → {self.usuario_recibe} ({self.estado})'

class Friendship(models.Model):
    """Relación de amistad confirmada."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friend_of', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user} - {self.friend}"
