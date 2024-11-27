from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .sql_queries import SQL_QUERIES


def execute_query(query_name, params=None):
    with connection.cursor() as cursor:
        cursor.execute(SQL_QUERIES[query_name], params or {})
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


@api_view(["GET"])
def top_favorited_neighborhoods(request):
    num_neighborhoods = request.GET.get("num", 10)
    results = execute_query("top_favorited_neighborhoods", {"num": num_neighborhoods})
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
    results = execute_query("get_user_preferences", {"user_id": user_id})
    return Response(results[0] if results else {})


@api_view(["GET"])
def filter_neighborhoods_by_price(request):
    params = {
        "min_price": request.GET.get("min_price"),
        "max_price": request.GET.get("max_price"),
    }
    results = execute_query("filter_neighborhoods_by_price", params)
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
