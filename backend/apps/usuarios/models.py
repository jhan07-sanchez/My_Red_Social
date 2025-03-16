from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.contrib.auth import get_user_model




class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Crea y devuelve un usuario con email y contraseña."""
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Crea y devuelve un superusuario."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuario personalizado."""
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=255)
    foto_perfil = models.ImageField(upload_to='perfil/', blank=True, null=True)
    biografia = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.email



class Amistad(models.Model):
    SOLICITUD_PENDIENTE = 'pendiente'
    ACEPTADA = 'aceptada'
    RECHAZADA = 'rechazada'

    ESTADOS_SOLICITUD = [
        (SOLICITUD_PENDIENTE, 'Pendiente'),
        (ACEPTADA, 'Aceptada'),
        (RECHAZADA, 'Rechazada'),
    ]

    usuario_envia = models.ForeignKey(Usuario, related_name='solicitudes_enviadas', on_delete=models.CASCADE)
    usuario_recibe = models.ForeignKey(Usuario, related_name='solicitudes_recibidas', on_delete=models.CASCADE)
    estado = models.CharField(max_length=10, choices=ESTADOS_SOLICITUD, default=SOLICITUD_PENDIENTE)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario_envia', 'usuario_recibe')

    def __str__(self):
        return f'{self.usuario_envia} → {self.usuario_recibe} ({self.estado})'



class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    friends = models.ManyToManyField('self', symmetrical=True, related_name='friend_list', blank=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username
    
    
class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Mensaje de {self.sender} a {self.receiver}'



User = get_user_model()

class FriendRequest(models.Model):
    from_user = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    accepted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('from_user', 'to_user')

class Friendship(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='friend_of', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)