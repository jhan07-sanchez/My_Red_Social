from django.urls import path
from .views.auth_views import RegistroView, LoginView, LogoutView, ActivarCuentaView
from .views.password_views import SolicitarRecuperacionView
from apps.usuarios.views.password_views import RestablecerContraseñaView


urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activar/<uidb64>/<token>/', ActivarCuentaView.as_view(), name='activar-cuenta'),
    path('recuperar/', SolicitarRecuperacionView.as_view(), name='solicitar-recuperacion'),
    path('recuperar/<uidb64>/<token>/', RestablecerContraseñaView.as_view(), name='reset-password'),
]
