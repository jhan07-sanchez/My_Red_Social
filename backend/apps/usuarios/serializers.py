from rest_framework import serializers
from .models import Usuario
from django.contrib.auth import authenticate

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombre', 'is_active']

class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'nombre', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        usuario = Usuario.objects.create_user(**validated_data)
        return usuario

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        usuario = authenticate(email=data['email'], password=data['password'])
        if not usuario:
            raise serializers.ValidationError('Credenciales incorrectas')
        return {'usuario': usuario}
