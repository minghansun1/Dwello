from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile, City
from django.db import transaction
from .utils import execute_query


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["id", "name", "state_id"]


class LocationSerializer(serializers.Serializer):
    location_name = serializers.CharField()


class ZipcodeSerializer(serializers.Serializer):
    zip_code = serializers.IntegerField()
    city_name = serializers.CharField()
    county_name = serializers.CharField()
    state_id = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)
    liked_neighborhoods = serializers.SerializerMethodField()
    liked_cities = serializers.SerializerMethodField()
    liked_states = serializers.SerializerMethodField()
    liked_zipcodes = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            "income",
            "city",
            "liked_neighborhoods",
            "liked_cities",
            "liked_states",
            "liked_zipcodes",
        ]

    def get_liked_neighborhoods(self, obj):
        results = execute_query("user_liked_locations", {
            "user_id": obj.user.id,
            "table_name": "neighborhood",
            "likes_table": "user_likes_neighborhood",
            "id_column": "id",
            "location_id_column": "neighborhood_id"
        })
        return LocationSerializer(results, many=True).data

    def get_liked_cities(self, obj):
        results = execute_query("user_liked_locations", {
            "user_id": obj.user.id,
            "table_name": "city",
            "likes_table": "user_likes_city",
            "id_column": "id",
            "location_id_column": "city_id"
        })
        return LocationSerializer(results, many=True).data

    def get_liked_states(self, obj):
        results = execute_query("user_liked_locations", {
            "user_id": obj.user.id,
            "table_name": "state",
            "likes_table": "user_likes_state",
            "id_column": "state_id",
            "location_id_column": "state_id"
        })
        return LocationSerializer(results, many=True).data

    def get_liked_zipcodes(self, obj):
        results = execute_query("user_liked_zipcodes", {"user_id": obj.user.id})
        return ZipcodeSerializer(results, many=True).data


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source="userprofile", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "profile"]
        read_only_fields = ["id"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    email = serializers.EmailField(required=True)
    income = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    city_name = serializers.CharField(write_only=True, required=False)
    state_id = serializers.CharField(max_length=2, write_only=True, required=False)

    class Meta:
        model = User
        fields = ["username", "password", "email", "income", "city_name", "state_id"]

    def validate(self, attrs):
        # Validate username uniqueness
        username = attrs.get("username")
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                {"username": "A user with this username already exists"}
            )

        # Validate email uniqueness
        email = attrs.get("email")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists"}
            )

        # Validate city and state are provided together
        if bool(attrs.get("city_name")) != bool(attrs.get("state_id")):
            raise serializers.ValidationError(
                {
                    "location": "Both city and state must be provided together if specifying location"
                }
            )

        return attrs

    def create(self, validated_data):
        city_name = validated_data.pop("city_name", None)
        state_id = validated_data.pop("state_id", None)
        income = validated_data.pop("income", None)

        with transaction.atomic():
            # Create user instance
            user = User.objects.create_user(
                username=validated_data["username"],
                email=validated_data["email"],
                password=validated_data["password"],
            )

            # Create or update profile
            city = None
            if city_name and state_id:
                try:
                    city = City.objects.get(
                        name__iexact=city_name, state__state_id=state_id.upper()
                    )
                except City.DoesNotExist:
                    raise serializers.ValidationError(
                        {
                            "location": f"City '{city_name}' in state '{state_id}' not found"
                        }
                    )

            UserProfile.objects.create(user=user, income=income, city=city)

            return user
