from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from .models import Usuario

def generar_token_activacion(usuario):
    """Genera un token de activación para el usuario."""
    return default_token_generator.make_token(usuario)

def enviar_email_activacion(usuario, request):
    """Envía un email con el enlace de activación."""
    token = generar_token_activacion(usuario)
    uid = urlsafe_base64_encode(force_bytes(usuario.pk))
    url_activacion = request.build_absolute_uri(reverse('activar-cuenta', kwargs={'uidb64': uid, 'token': token}))

    asunto = 'Activa tu cuenta'
    mensaje = f'Hola {usuario.nombre}, haz clic en el siguiente enlace para activar tu cuenta: {url_activacion}'
    
    send_mail(asunto, mensaje, settings.DEFAULT_FROM_EMAIL, [usuario.email])
    

def enviar_email_recuperacion(usuario, request):
    """Envía un email con el enlace para restablecer la contraseña."""
    token = generar_token_recuperacion(usuario)
    uid = urlsafe_base64_encode(force_bytes(usuario.pk))
    url_recuperacion = request.build_absolute_uri(reverse('reset-password', kwargs={'uidb64': uid, 'token': token}))

    asunto = 'Recuperación de contraseña'
    mensaje = f'Hola {usuario.nombre}, haz clic en el siguiente enlace para restablecer tu contraseña: {url_recuperacion}'
    
    send_mail(asunto, mensaje, settings.DEFAULT_FROM_EMAIL, [usuario.email])    
