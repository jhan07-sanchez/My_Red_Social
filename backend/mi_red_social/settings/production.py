from .base import BASE_DIR

DEBUG = False

ALLOWED_HOSTS = ['192.168.101.7']

CORS_ALLOWED_ORIGINS = [
    "http://192.168.101.7:8081",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'nombre_db',
        'USER': 'usuario_db',
        'PASSWORD': 'contraseña_segura',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_ROOT = BASE_DIR / 'mediafiles'
