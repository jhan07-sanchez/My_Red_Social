from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.usuarios.models import UserProfile
from apps.usuarios.serializers import FollowSerializer
from django.contrib.auth.models import User

class FollowUserView(APIView):
    def post(self, request, username):
        user_to_follow = get_object_or_404(User, username=username)
        profile_to_follow = user_to_follow.profile
        user_profile = request.user.profile

        if profile_to_follow != user_profile:
            if profile_to_follow.followers.filter(id=user_profile.id).exists():
                profile_to_follow.followers.remove(user_profile)
                return Response({'message': 'Unfollowed'}, status=status.HTTP_200_OK)
            else:
                profile_to_follow.followers.add(user_profile)
                return Response({'message': 'Followed'}, status=status.HTTP_200_OK)

        return Response({'error': 'No puedes seguirte a ti mismo'}, status=status.HTTP_400_BAD_REQUEST)
