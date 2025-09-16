from django.db import models
from apps.usuarios.models import Usuario  # Asegúrate de importar correctamente el usuario

class Message(models.Model):
    sender = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"
