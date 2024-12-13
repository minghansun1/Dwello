from django.db import connection
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from .sql_queries import SQL_QUERIES
from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from .models import UserProfile
from .serializers import UserSignupSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def user_signup(request):
    print(request)
    try:
        serializer = UserSignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Create user and profile
        user = serializer.save()
        
        # Create token for the new user
        token = Token.objects.create(user=user)

        # Log in the user
        login(request, user)

        # Get the user profile
        profile = user.userprofile
        city = profile.city

        return Response({
            "message": "User created and logged in successfully",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "income": profile.income,
                "city": {
                    "name": city.name,
                    "state": city.state.state_id
                } if city else None
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def user_login(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")
        
        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create token
        token, _ = Token.objects.get_or_create(user=user)
        
        # Get user profile info
        profile = user.userprofile
        city = profile.city if hasattr(user, 'userprofile') else None

        return Response({
            "message": "Login successful",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "city": {
                    "name": city.name,
                    "state": city.state.state_id
                } if city else None
            }
        })

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
def user_logout(request):
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        logout(request)
        return Response({"message": "Successfully logged out"})

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def execute_query(query_name, params=None):
    with connection.cursor() as cursor:
        cursor.execute(SQL_QUERIES[query_name], params or {})
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


@api_view(["GET"])
def top_liked_locations(request):
    num_locations = request.GET.get("num", 10)
    results = execute_query("top_liked_locations", {"num": num_locations})
    return Response(results)


@api_view(["GET"])
def neighborhood_price_ranking(request):
    results = execute_query("neighborhood_price_ranking")
    return Response(results)


@api_view(["GET"])
def city_price_ranking(request):
    results = execute_query("city_price_ranking")
    return Response(results)


@api_view(["POST"])
def preference_based_ranking(request):
    params = {
        "preferred_cost_of_living": request.data.get("preferred_cost_of_living"),
        "preferred_median_home_price": request.data.get("preferred_median_home_price"),
        "preferred_median_income": request.data.get("preferred_median_income"),
        "preferred_crime_rate": request.data.get("preferred_crime_rate"),
        "preferred_industry_income": request.data.get("preferred_industry_income"),
        "importance_cost_of_living": request.data.get("importance_cost_of_living", 1),
        "importance_median_home_price": request.data.get(
            "importance_median_home_price", 1
        ),
        "importance_median_income": request.data.get("importance_median_income", 1),
        "importance_crime_rate": request.data.get("importance_crime_rate", 1),
        "importance_industry_income": request.data.get("importance_industry_income", 1),
        "num": request.data.get("num", 10),
    }
    results = execute_query("preference_based_ranking", params)
    return Response(results)


@api_view(["GET"])
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
def get_user_favorites(request, user_id):
    results = execute_query("get_user_favorites", {"target_user_id": user_id})
    return Response(results)


@api_view(["GET"])
def count_natural_disasters(request):
    results = execute_query("count_natural_disasters")
    return Response(results)


@api_view(["POST"])
def find_nearest_cities(request):
    params = {
        "target_latitude": request.GET.get("latitude"),
        "target_longitude": request.GET.get("longitude"),
        "num": request.GET.get("num", 10),
    }
    results = execute_query("find_nearest_cities", params)
    return Response(results)
