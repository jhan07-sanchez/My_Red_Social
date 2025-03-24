from django.urls import path
from .views.auth_views import RegistroView, LoginView, LogoutView, ActivarCuentaView, UsuarioMeView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activar/<uidb64>/<token>/', ActivarCuentaView.as_view(), name='activar-cuenta'),
    path('me/', UsuarioMeView.as_view(), name='usuario-me'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
