from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.urls import reverse
from django.conf import settings
from .models import Usuario
import random
from django.utils import timezone   




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
    
    
def generar_otp():
    """Genera un código OTP de 6 dígitos."""
    return str(random.randint(100000, 999999))


def enviar_codigo_otp(usuario):
    """Envía un correo con el código OTP al usuario."""
    mensaje = f"""
Hola {usuario.nombre},

Tu código de verificación para activar tu cuenta en SocialLink es: {usuario.otp}

Este código vence en 10 minutos. Si no solicitaste este código, puedes ignorar este mensaje.

Gracias por unirte a nuestra comunidad.
"""

    send_mail(
        subject="Verificación de cuenta - SocialLink",
        message=mensaje.strip(),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[usuario.email],
        fail_silently=False,
    )