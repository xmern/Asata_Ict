from rest_framework import serializers
from .services import UserDataClass,user_email_selector

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    
    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        return UserDataClass(**data)
    def validate_email(self, value):
        """
        Check that the email is unique.
        """
        if user_email_selector(value):
            raise serializers.ValidationError("A user with this email already exists.")
        return value    