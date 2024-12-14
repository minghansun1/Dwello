from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, City
from django.db import transaction

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'state_id']

class UserProfileSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['income', 'city']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
        read_only_fields = ['id']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    income = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    city_name = serializers.CharField(write_only=True, required=False)
    state_id = serializers.CharField(max_length=2, write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'income', 'city_name', 'state_id']

    def validate(self, attrs):
        # Validate username uniqueness
        username = attrs.get('username')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists"})
            
        # Validate email uniqueness
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists"})

        # Validate city and state are provided together
        if bool(attrs.get('city_name')) != bool(attrs.get('state_id')):
            raise serializers.ValidationError(
                {"location": "Both city and state must be provided together if specifying location"}
            )

        return attrs

    def create(self, validated_data):
        city_name = validated_data.pop('city_name', None)
        state_id = validated_data.pop('state_id', None)
        income = validated_data.pop('income', None)

        with transaction.atomic():
            # Create user instance
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password']
            )

            # Create or update profile
            city = None
            if city_name and state_id:
                try:
                    city = City.objects.get(
                        name__iexact=city_name,
                        state__state_id=state_id.upper()
                    )
                except City.DoesNotExist:
                    raise serializers.ValidationError(
                        {"location": f"City '{city_name}' in state '{state_id}' not found"}
                    )

            UserProfile.objects.create(
                user=user,
                income=income,
                city=city
            )

            return user
