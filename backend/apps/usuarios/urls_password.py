from django.urls import path
from .views.password_views import SolicitarRecuperacionView, RestablecerContraseñaView

urlpatterns = [
    path(
        "solicitar/", SolicitarRecuperacionView.as_view(), name="solicitar-recuperacion"
    ),
    path(
        "restablecer/<uidb64>/<token>/",
        RestablecerContraseñaView.as_view(),
        name="reset-password",
    ),
]
