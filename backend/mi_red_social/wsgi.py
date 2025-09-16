"""
WSGI config for mi_red_social project.
"""

import os
import sys

# 👇 Asegúrate de que esta ruta es donde está manage.py
sys.path.append("/var/www/mi_red_social/backend")

# Establece el entorno de Django
os.environ.setdefault("DJANGO_ENV", "production")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mi_red_social.settings.production")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
