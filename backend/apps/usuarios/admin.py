from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Panel profesional de administración para usuarios personalizados."""

    # Lo que aparece en la lista principal
    list_display = (
        "id", "email", "nombre", "is_active", "is_staff", "is_superuser", "mostrar_foto"
    )
    list_display_links = ("email", "nombre")
    list_filter = ("is_active", "is_staff", "is_superuser", "groups")
    search_fields = ("email", "nombre")
    ordering = ("id",)

    # Campos de solo lectura (incluimos la foto de perfil renderizada)
    readonly_fields = ("otp_created_at", "last_login", "mostrar_foto")

    # Secciones del formulario
    fieldsets = (
        ("📌 Información personal", {
            "fields": ("email", "nombre", "biografia", "foto_perfil", "mostrar_foto")
        }),
        ("🔐 Seguridad", {
            "fields": ("password", "otp", "otp_created_at")
        }),
        ("⚙️ Permisos y roles", {
            "fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        ("📅 Actividad", {
            "fields": ("last_login",)
        }),
    )

    # Para el formulario de creación de usuario en admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "nombre", "password1", "password2", "is_active", "is_staff", "is_superuser"),
        }),
    )

    # Mostrar miniatura de foto en lista y detalle
    def mostrar_foto(self, obj):
        if obj.foto_perfil:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius:50%; object-fit:cover;" />',
                obj.foto_perfil.url
            )
        return "—"
    mostrar_foto.short_description = "Foto perfil"
