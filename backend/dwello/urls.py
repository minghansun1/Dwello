from django.urls import path
from . import views

app_name = 'dwello'
urlpatterns = [
    path('auth/signup/', views.user_signup, name='user-signup'),
    path('auth/login/', views.user_login, name='user-login'),
    path('auth/logout/', views.user_logout, name='user-logout'),
    path('neighborhoods/top-favorited/', views.top_liked_locations, name='top-favorited-neighborhoods'),
    path('neighborhoods/price-ranking/', views.neighborhood_price_ranking, name='neighborhood-price-ranking'),
    path('cities/price-ranking/', views.city_price_ranking, name='city-price-ranking'),
    path('neighborhoods/preference-ranking/', views.preference_based_ranking, name='preference-based-ranking'),
    path('cities/high-cost/', views.high_cost_cities_by_state, name='high-cost-cities'),
    path('users/<int:user_id>/preferences/', views.get_user_preferences, name='user-preferences'),
    path('neighborhoods/filter-by-price/', views.filter_neighborhoods, name='filter-neighborhoods'),
    path('users/<int:user_id>/favorites/', views.get_user_favorites, name='user-favorites'),
    path('states/natural-disasters/', views.count_natural_disasters, name='natural-disasters'),
    path('cities/nearest/', views.find_nearest_cities, name='nearest-cities'),
]
