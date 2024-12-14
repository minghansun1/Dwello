from rest_framework.decorators import (
    api_view,
    action,
    permission_classes,
)
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from .models import UserProfile
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import serializers
from rest_framework import viewsets
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
)
from rest_framework.exceptions import ValidationError
from .models import City, State, Neighborhood, ZipCountyCode
from django.shortcuts import get_object_or_404
from .utils import execute_query

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling all user-related operations including authentication
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        """
        Override to allow registration, login, and token refresh without authentication
        """
        if self.action in ['register', 'login', 'refresh_token']:
            return [AllowAny()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action
        """
        if self.action == 'register':
            return UserRegistrationSerializer
        return self.serializer_class

    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        User registration endpoint
        """
        if not request.data:
            return Response(
                {"error": "No data provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)

        try:
            if not serializer.is_valid():
                return Response(
                    {"error": "Validation failed", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            login(request, user)

            profile = user.userprofile
            city = profile.city

            return Response(
                {
                    "message": "User created and logged in successfully",
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "income": profile.income,
                        "city": (
                            {"name": city.name, "state": city.state.state_id}
                            if city
                            else None
                        ),
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except serializers.ValidationError as e:
            return Response(
                {"error": "Validation error", "details": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "error": "An unexpected error occurred",
                    "details": str(e),
                    "type": type(e).__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def login(self, request):
        """
        User login endpoint
        """
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            print("USERNAME: ", username)
            print("PASSWORD: ", password)

            if not username or not password:
                return Response(
                    {"error": "Please provide both username and password"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = authenticate(username=username, password=password)

            if not user:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            refresh = RefreshToken.for_user(user)

            profile = user.userprofile
            city = profile.city if hasattr(user, "userprofile") else None

            return Response(
                {
                    "message": "Login successful",
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "city": (
                            {"name": city.name, "state": city.state.state_id}
                            if city
                            else None
                        ),
                    },
                }
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["post"])
    def logout(self, request):
        """
        User logout endpoint. 
        Blacklists the current refresh token to prevent its future use.
        Requires authentication.
        """
        try:
            # Get the refresh token from request
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Blacklist refresh token
            try:
                token = RefreshToken(refresh_token)
                print("REFRESH TOKEN: ", token)
                token.blacklist()
                print("REFRESH TOKEN BLACKLISTED")
            except Exception as e:
                return Response(
                    {"error": "Invalid refresh token: " + str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Perform Django's logout
            logout(request)

            return Response(
                {"message": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            error_message = str(e)
            return Response(
                {"error": error_message}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=["get"])
    def get_user_profile(self, request):
        """
        Get current user's profile. Requires authentication.
        """
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'])
    def like_location(self, request):
        """
        Toggle like status for a location (zipcode, neighborhood, city, or state).
        If already liked, it will unlike it. If not liked, it will like it.
        Requires authentication.
        """
        location_type = request.data.get('type')
        location_id = request.data.get('id')

        if not location_type or not location_id:
            raise ValidationError({"error": "Both type and id are required"})

        location_mapping = {
            'zipcode': {
                'table_name': 'user_likes_zipcode',
                'id_column': 'zip_code',
                'validator': lambda id: get_object_or_404(ZipCountyCode, code=id)
            },
            'neighborhood': {
                'table_name': 'user_likes_neighborhood',
                'id_column': 'neighborhood_id',
                'validator': lambda id: get_object_or_404(Neighborhood, id=id)
            },
            'city': {
                'table_name': 'user_likes_city',
                'id_column': 'city_id',
                'validator': lambda id: get_object_or_404(City, id=id)
            },
            'state': {
                'table_name': 'user_likes_state',
                'id_column': 'state_id',
                'validator': lambda id: get_object_or_404(State, state_id=id)
            }
        }

        if location_type not in location_mapping:
            raise ValidationError({"error": f"Invalid location type. Must be one of: {', '.join(location_mapping.keys())}"})

        mapping = location_mapping[location_type]
        mapping['validator'](location_id)

        # Check if already liked
        check_result = execute_query("check_if_liked", {
            'table_name': mapping['table_name'],
            'id_column': mapping['id_column'],
            'user_id': request.user.id,
            'location_id': location_id
        })

        if check_result[0]['exists']:
            # Unlike
            execute_query("unlike_location", {
                'table_name': mapping['table_name'],
                'id_column': mapping['id_column'],
                'user_id': request.user.id,
                'location_id': location_id
            })
            message = "unliked"
        else:
            # Like
            execute_query("like_location", {
                'table_name': mapping['table_name'],
                'id_column': mapping['id_column'],
                'user_id': request.user.id,
                'location_id': location_id
            })
            message = "liked"

        return Response({
            "status": "success",
            "message": f"Successfully {message} {location_type} {location_id}"
        })    


@api_view(["GET"])
@permission_classes([AllowAny])
def neighborhood_price_ranking(request):
    results = execute_query("neighborhood_price_ranking")
    return Response(results)


@api_view(["GET"])
@permission_classes([AllowAny])
def city_price_ranking(request):
    results = execute_query("city_price_ranking")
    return Response(results)


@api_view(["POST"])
@permission_classes([AllowAny])
def preference_based_ranking(request):
    params = {
        "preferred_cost_of_living": request.data.get("preferred_cost_of_living"),
        "preferred_median_home_price": request.data.get("preferred_median_home_price"),
        "preferred_median_family_income": request.data.get("preferred_median_income"),
        "preferred_crime_rate": request.data.get("preferred_crime_rate"),
        "industry_name": request.data.get("industry_name"),
        "preferred_industry_salary": request.data.get("preferred_industry_salary"),
        "preferred_industry_jobs_1000": request.data.get("preferred_industry_jobs_1000"),
        "preferred_population_density": request.data.get("preferred_population_density"),
        "preferred_population": request.data.get("preferred_population"),
        "preferred_latitude": request.data.get("preferred_latitude"),
        "preferred_longitude": request.data.get("preferred_longitude"),
        "preferred_natural_disaster_count": request.data.get("preferred_natural_disaster_count"),

        "importance_cost_of_living": request.data.get("importance_cost_of_living", 0),
        "importance_median_home_price": request.data.get("importance_median_home_price", 0),
        "importance_median_family_income": request.data.get("importance_median_income", 0),
        "importance_crime_rate": request.data.get("importance_crime_rate", 0),
        "importance_industry_salary": request.data.get("importance_industry_salary", 0),
        "importance_industry_jobs_1000": request.data.get("importance_industry_jobs_1000", 0),
        "importance_population_density": request.data.get("importance_population_density", 0),
        "importance_population": request.data.get("importance_population", 0),
        "importance_location": request.data.get("importance_location", 0),
        "importance_natural_disaster_count": request.data.get("importance_natural_disaster_count", 0),
        "num": request.data.get("num", 50),
    }
    print(params)
    results = execute_query("preference_based_ranking", params)
    return Response(results)


@api_view(["GET"])
@permission_classes([AllowAny])
def high_cost_cities_by_state(request):
    results = execute_query("high_cost_cities_by_state")
    return Response(results)


@api_view(["GET"])
def get_user_preferences(request, user_id):
    try:
        user_profile = UserProfile.objects.select_related("user", "preferred_city").get(
            user_id=user_id
        )

        return Response(
            {
                "username": user_profile.user.username,
                "income": user_profile.income,
                "preferred_city": (
                    {
                        "id": user_profile.preferred_city.id,
                        "name": user_profile.preferred_city.name,
                    }
                    if user_profile.preferred_city
                    else None
                ),
            }
        )
    except UserProfile.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def filter_neighborhoods(request):
    params = {
        "min_price": request.GET.get("min_price"),
        "max_price": request.GET.get("max_price"),
        "max_crime": request.GET.get("max_crime"),
        "max_latitude": request.GET.get("max_latitude"),
        "min_latitude": request.GET.get("min_latitude"),
        "max_longitude": request.GET.get("max_longitude"),
        "min_longitude": request.GET.get("min_longitude"),
        "max_cost_of_living": request.GET.get("max_cost_of_living"),
        "min_cost_of_living": request.GET.get("min_cost_of_living"),
        "zip_code": request.GET.get("zip_code"),
        "max_natural_disaster_count": request.GET.get("max_natural_disaster_count"),
        "max_pop_density": request.GET.get("max_pop_density"),
        "max_pop": request.GET.get("max_pop"),
        "num": request.GET.get("num", 10),
    }
    results = execute_query("filter_neighborhoods", params)
    return Response(results)


@api_view(["GET"])
@permission_classes([AllowAny])
def count_natural_disasters(request):
    results = execute_query("count_natural_disasters")
    return Response(results)


@api_view(["POST"])
@permission_classes([AllowAny])
def find_nearest_cities(request):
    params = {
        "target_latitude": request.GET.get("latitude"),
        "target_longitude": request.GET.get("longitude"),
        "num": request.GET.get("num", 10),
    }
    results = execute_query("find_nearest_cities", params)
    return Response(results)


@api_view(["GET"])
@permission_classes([AllowAny])
def top_liked_locations(request):
    """
    Get the most liked locations of a specific type.
    Returns up to 100 results, ordered by favorite count.
    
    Supported types: zipcode, neighborhood, city, state
    
    Query parameters:
    - type: The type of location (required)
    """
    location_type = request.GET.get('type')

    if not location_type:
        return Response(
            {"error": "Location type is required. Use 'type' parameter in URL query"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Define mapping for different location types
    location_mapping = {
        'zipcode': {
            'query': 'top_liked_zipcodes',
            'params': {
                'table_name': 'zip_county_code',
                'likes_table': 'user_likes_zipcode',
                'id_column': 'code',
                'location_id_column': 'zip_code'
            }
        },
        'neighborhood': {
            'query': 'top_liked_location',
            'params': {
                'table_name': 'neighborhood',
                'likes_table': 'user_likes_neighborhood',
                'id_column': 'id',
                'location_id_column': 'neighborhood_id'
            }
        },
        'city': {
            'query': 'top_liked_location',
            'params': {
                'table_name': 'city',
                'likes_table': 'user_likes_city',
                'id_column': 'id',
                'location_id_column': 'city_id'
            }
        },
        'state': {
            'query': 'top_liked_location',
            'params': {
                'table_name': 'state',
                'likes_table': 'user_likes_state',
                'id_column': 'state_id',
                'location_id_column': 'state_id'
            }
        }
    }

    if location_type not in location_mapping:
        return Response(
            {
                "error": f"Invalid location type. Must be one of: {', '.join(location_mapping.keys())}"
            }, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        mapping = location_mapping[location_type]
        results = execute_query(mapping['query'], mapping['params'])
        return Response(results)

    except Exception as e:
        return Response(
            {
                "error": "An error occurred while fetching top liked locations",
                "details": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
