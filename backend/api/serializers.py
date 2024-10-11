from rest_framework import serializers
from .models import Profile, Bug

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "username", "password", "role"]
        extra_kwargs = {"password": {"write_only": True, "required": True}, "role": {"required": True,}}

    def create(self, validated_data):
        profile = Profile.objects.create_user(**validated_data)
        return profile
    
class BugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bug
        fields = "__all__"
        read_only_fields = ["created_by", "logs"]
        extra_kwargs = {"assigned_to": {"required": True},"created_at": {"read_only": True}}

    def create(self, validated_data):
        bug = Bug.objects.create(**validated_data)
        return bug