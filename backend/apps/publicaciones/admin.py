from django.contrib import admin, messages
from django.utils.html import format_html
from .models import Publicacion, Comentario, Reaccion


@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "usuario",
        "contenido_corto",
        "miniatura",
        "privacidad",
        "fecha_creacion",
    )
    list_filter = ("privacidad", "fecha_creacion", "usuario")
    search_fields = ("contenido", "usuario__email", "usuario__nombre")
    ordering = ("-fecha_creacion",)
    readonly_fields = ("fecha_creacion", "miniatura")
    list_per_page = 20

    actions = ["marcar_como_publico", "marcar_como_privado", "eliminar_publicaciones"]

    fieldsets = (
        ("Información principal", {
            "fields": ("usuario", "contenido", "imagen", "miniatura", "privacidad"),
        }),
        ("Metadatos", {
            "fields": ("fecha_creacion",),
        }),
    )

    def contenido_corto(self, obj):
        return (obj.contenido[:50] + "...") if len(obj.contenido) > 50 else obj.contenido
    contenido_corto.short_description = "Contenido"

    def miniatura(self, obj):
        if obj.imagen:
            return format_html(
                '<img src="{}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;" />',
                obj.imagen.url
            )
        return "—"
    miniatura.short_description = "Imagen"

    # 🔹 Acciones personalizadas
    def marcar_como_publico(self, request, queryset):
        updated = queryset.update(privacidad="publico")
        self.message_user(request, f"{updated} publicaciones marcadas como públicas ✅", messages.SUCCESS)
    marcar_como_publico.short_description = "Marcar como públicas"

    def marcar_como_privado(self, request, queryset):
        updated = queryset.update(privacidad="privado")
        self.message_user(request, f"{updated} publicaciones marcadas como privadas 🔒", messages.WARNING)
    marcar_como_privado.short_description = "Marcar como privadas"

    def eliminar_publicaciones(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"{count} publicaciones eliminadas 🗑️", messages.ERROR)
    eliminar_publicaciones.short_description = "Eliminar publicaciones seleccionadas"


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ("id", "publicacion", "usuario", "contenido_corto", "fecha_creacion")
    list_filter = ("fecha_creacion", "usuario")
    search_fields = ("contenido", "usuario__email", "usuario__nombre")
    ordering = ("-fecha_creacion",)
    readonly_fields = ("fecha_creacion",)
    list_per_page = 30

    actions = ["eliminar_comentarios"]

    def contenido_corto(self, obj):
        return (obj.contenido[:40] + "...") if len(obj.contenido) > 40 else obj.contenido
    contenido_corto.short_description = "Comentario"

    def eliminar_comentarios(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"{count} comentarios eliminados 🚫", messages.ERROR)
    eliminar_comentarios.short_description = "Eliminar comentarios seleccionados"


@admin.register(Reaccion)
class ReaccionAdmin(admin.ModelAdmin):
    list_display = ("id", "publicacion", "usuario", "tipo", "fecha_creacion")
    list_filter = ("tipo", "fecha_creacion", "usuario")
    search_fields = ("usuario__email", "usuario__nombre", "publicacion__contenido")
    ordering = ("-fecha_creacion",)
    readonly_fields = ("fecha_creacion",)
    list_per_page = 30

    actions = ["eliminar_reacciones"]

    def eliminar_reacciones(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"{count} reacciones eliminadas 👋", messages.ERROR)
    eliminar_reacciones.short_description = "Eliminar reacciones seleccionadas"

