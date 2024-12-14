from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')

app_name = 'dwello'
urlpatterns = [
    path('', include(router.urls)),
    path('neighborhoods/price-ranking/', views.neighborhood_price_ranking, name='neighborhood-price-ranking'),
    path('cities/price-ranking/', views.city_price_ranking, name='city-price-ranking'),
    path('neighborhoods/preference-ranking/', views.preference_based_ranking, name='preference-based-ranking'),
    path('cities/high-cost/', views.high_cost_cities_by_state, name='high-cost-cities'),
    path('users/<int:user_id>/preferences/', views.get_user_preferences, name='user-preferences'),
    path('neighborhoods/filter-by-price/', views.filter_neighborhoods, name='filter-neighborhoods'),
    path('states/natural-disasters/', views.count_natural_disasters, name='natural-disasters'),
    path('cities/nearest/', views.find_nearest_cities, name='nearest-cities'),
    path('top-liked-locations/', views.top_liked_locations, name='top-liked-locations'),
]
