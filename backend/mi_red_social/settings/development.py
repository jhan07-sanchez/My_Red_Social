from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.56.1:3000"
]

# Base de datos apuntando al servidor (si quieres usar la misma que prod)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mi_red_social',
        'USER': 'red_social',
        'PASSWORD': '1007773621',
        'HOST': '192.168.101.7',
        'PORT': '5432',
    }
}

