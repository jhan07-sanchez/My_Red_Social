from .base import *  # noqa: F403, F401

#  DEBUG siempre debe estar activo en desarrollo
DEBUG = True

#  Hosts permitidos en desarrollo
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

#  CORS para permitir acceso desde tu frontend local
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.56.1:3000",
]

#  Base de datos PostgreSQL en servidor local
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mi_red_social",
        "USER": "red_social",
        "PASSWORD": "1007773621",
        "HOST": "192.168.101.7",
        "PORT": "5432",
    }
}

#  Rutas para archivos estáticos y multimedia
STATIC_URL = "/static/"
MEDIA_URL = "/media/"

#  Archivo de URLs raíz (normalmente se mantiene así)
ROOT_URLCONF = "mi_red_social.urls"
