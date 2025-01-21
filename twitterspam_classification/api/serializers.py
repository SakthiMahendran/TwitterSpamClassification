from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']  # Update fields as per your model
        extra_kwargs = {'password': {'write_only': True}}
