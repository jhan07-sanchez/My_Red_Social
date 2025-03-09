from django.urls import path
from .views import RegistroView, LoginView, UsuarioView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('usuario/', UsuarioView.as_view(), name='usuario'),
]
