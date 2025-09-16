from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

Usuario = get_user_model()


class EmailAuthBackend(BaseBackend):
    """Autenticación con email en lugar de username."""

    def authenticate(self, request, email=None, password=None, **kwargs):
        print("Entró al backend personalizado con:", email, password)  # 👈 agrega esto
        try:
            user = Usuario.objects.get(email=email)
            if user.check_password(password):  # 🔥 Verifica la contraseña
                return user
        except Usuario.DoesNotExist:
            return None
