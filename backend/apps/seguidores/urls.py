from django.urls import path
from .views import FollowUserView

urlpatterns = [
    path('<str:username>/', FollowUserView.as_view(), name='follow-user'),
]
