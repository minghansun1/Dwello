from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, City
from django.db import transaction

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['income', 'city', 'state']

class UserSignupSerializer(serializers.ModelSerializer):
    income = serializers.DecimalField(max_digits=15, decimal_places=2, required=False)
    city_name = serializers.CharField(write_only=True, required=False)
    state_id = serializers.CharField(max_length=2, write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'income', 'city_name', 'state_id']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # Check if user already exists
        username = data.get('username')
        email = data.get('email')
        
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({
                "username": "A user with this username already exists"
            })
            
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({
                "email": "A user with this email already exists"
            })

        # Check if city and state are provided together
        if (data.get('city_name') and not data.get('state_id')) or \
           (data.get('state_id') and not data.get('city_name')):
            raise serializers.ValidationError({
                "location": "Both city and state must be provided together if specifying location"
            })
        return data

    @transaction.atomic
    def create(self, validated_data):
        try:
            # Remove city_name and state_id from validated_data
            city_name = validated_data.pop('city_name', None)
            state_id = validated_data.pop('state_id', None)
            income = validated_data.pop('income', None)

            # Create the user
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                password=validated_data['password']
            )
            
            # Attempt to get city if city_name and state_id are provided
            city = None
            if city_name and state_id:
                try:
                    city = City.objects.get(
                        name__iexact=city_name,
                        state__state_id=state_id.upper()
                    )
                except City.DoesNotExist:
                    raise serializers.ValidationError({
                        "location": f"City '{city_name}' in state '{state_id}' not found"
                    })

            # Create UserProfile
            UserProfile.objects.create(
                user=user,
                income=income,
                city=city,
            )

            return user

        except Exception as e:
            # If any error occurs, the transaction will be rolled back
            raise serializers.ValidationError({
                "error": str(e)
            })
