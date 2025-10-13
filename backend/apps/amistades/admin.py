from django.contrib import admin
from .models import Amistad

@admin.register(Amistad)
class AmistadAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario_envia', 'usuario_recibe', 'estado', 'fecha_solicitud')
    list_filter = ('estado', 'fecha_solicitud')
    search_fields = ('usuario_envia__email', 'usuario_recibe__email')
