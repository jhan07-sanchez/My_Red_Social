from .base import *  # noqa: F403, F401

DEBUG = False

ALLOWED_HOSTS = ['192.168.101.7', '192.168.101.7:8090']

CORS_ALLOWED_ORIGINS = [
    "http://192.168.101.7:8081",
]

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

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

#  Archivo de URLs raíz (normalmente se mantiene así)
ROOT_URLCONF = 'mi_red_social.urls'

STATIC_ROOT = BASE_DIR / 'static'
MEDIA_ROOT = BASE_DIR / 'media'


# Configuración importante para producción
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'django_errors.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
