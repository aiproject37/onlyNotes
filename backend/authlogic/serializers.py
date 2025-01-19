from rest_framework import serializers
from authlogic.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class RegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
    class Meta:
        model = User
        fields = ["email","name","tc","password","password2"]
        extra_kwargs = {
            "password": {"write_only": True}
        }
    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data
       

    def create(self, validated_data):
        return User.objects.create_user(validated_data["email"], validated_data["name"],validated_data["tc"], validated_data["password"], validated_data["password2"])

class LoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        refresh_token = attrs.get("refresh")
        try:
            # Attempt to create a RefreshToken instance
            token = RefreshToken(refresh_token)
        except Exception:
            raise serializers.ValidationError("Invalid or expired refresh token.")
        return attrs

    def save(self, **kwargs):
        refresh_token = self.validated_data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Blacklist the refresh token