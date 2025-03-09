from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models

class UsuarioManager(BaseUserManager):
    def create_user(self, email, nombre, password=None):
        if not email:
            raise ValueError('El usuario debe tener un email')
        email = self.normalize_email(email)
        usuario = self.model(email=email, nombre=nombre)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, nombre, password):
        usuario = self.create_user(email, nombre, password)
        usuario.is_admin = True
        usuario.is_staff = True
        usuario.is_superuser = True
        usuario.save(using=self._db)
        return usuario

class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=255)
    is_active = models.BooleanField(default=False)  # Verificación por email
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name="usuario_groups",  # Evita conflicto con auth.User.groups
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="usuario_permissions",  # Evita conflicto con auth.User.user_permissions
        blank=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.email

