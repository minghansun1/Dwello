from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from decimal import Decimal
from .models import (
    UserProfile, City, State, Neighborhood, 
    ZipCountyCode, UserLikesNeighborhood, 
    UserLikesCity, UserLikesState, UserLikesZipcode
)

User = get_user_model()

class DwelloAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test locations
        self.state = State.objects.create(
            state_id='PA',
            name='Pennsylvania'
        )
        
        self.city = City.objects.create(
            name='Philadelphia',
            state=self.state,
            county='Philadelphia',
            lat=39.9526,
            lng=-75.1652,
            population=1500000,
            density=11379.5,
            crime_rate=24.5
        )
        
        self.neighborhood = Neighborhood.objects.create(
            name='University City',
            city=self.city,
            state=self.state
        )
        
        self.zipcode = ZipCountyCode.objects.create(
            code=19104,
            city='Philadelphia',
            state=self.state,
            county='Philadelphia'
        )
        
        # Create user profile
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            income=Decimal('75000.00'),
            city=self.city
        )
        
        # Get JWT token
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_authentication(self):
        """Test authentication edge cases"""
        # Test with no token
        self.client.credentials()  # Clear auth
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test with invalid token
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Test with expired token
        # TODO: Add test for expired token scenario

    def test_user_profile(self):
        """Test user profile edge cases"""
        # Test normal case
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Test with deleted profile
        self.user_profile.delete()
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Test with deleted city reference
        self.user_profile = UserProfile.objects.create(user=self.user)
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data['city'])

    def test_like_location_edge_cases(self):
        """Test location liking edge cases"""
        # Test missing parameters
        response = self.client.post(reverse('user-like-location'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(reverse('user-like-location'), {'type': 'neighborhood'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test invalid location type
        response = self.client.post(reverse('user-like-location'), {
            'type': 'invalid_type',
            'id': 1
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test non-existent location
        response = self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': 99999
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Test double-liking
        response = self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': self.neighborhood.id
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        response = self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': self.neighborhood.id
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('unliked', response.data['message'])

    def test_filter_neighborhoods_edge_cases(self):
        """Test neighborhood filtering edge cases"""
        # Test with invalid numeric parameters
        response = self.client.post(reverse('filter-neighborhoods'), {
            'min_price': 'invalid',
            'max_price': 1000000
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with invalid range (min > max)
        response = self.client.post(reverse('filter-neighborhoods'), {
            'min_price': 1000000,
            'max_price': 100000
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with out-of-bounds coordinates
        response = self.client.post(reverse('filter-neighborhoods'), {
            'min_latitude': 100,
            'max_latitude': 200
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with no results
        response = self.client.post(reverse('filter-neighborhoods'), {
            'min_price': 999999999,
            'max_price': 1000000000
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_find_nearest_cities_edge_cases(self):
        """Test nearest cities search edge cases"""
        # Test with missing coordinates
        response = self.client.post(reverse('find-nearest-cities'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with invalid coordinates
        response = self.client.post(reverse('find-nearest-cities'), {
            'latitude': 'invalid',
            'longitude': -75.1652
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with out-of-bounds coordinates
        response = self.client.post(reverse('find-nearest-cities'), {
            'latitude': 100,
            'longitude': 200
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with negative num parameter
        response = self.client.post(reverse('find-nearest-cities'), {
            'latitude': 39.9526,
            'longitude': -75.1652,
            'num': -1
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_preference_based_ranking_edge_cases(self):
        """Test preference-based ranking edge cases"""
        # Test with missing required parameters
        response = self.client.post(reverse('preference-based-ranking'), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with invalid importance weights
        response = self.client.post(reverse('preference-based-ranking'), {
            'preferred_cost_of_living': 3000,
            'importance_cost_of_living': -1
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test with all zero importance weights
        response = self.client.post(reverse('preference-based-ranking'), {
            'preferred_cost_of_living': 3000,
            'importance_cost_of_living': 0,
            'importance_median_home_price': 0,
            'importance_median_income': 0,
            'importance_crime_rate': 0,
            'importance_industry_income': 0
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_concurrent_likes(self):
        """Test concurrent like operations"""
        # TODO: Implement concurrent operation testing
        pass

    def test_data_consistency(self):
        """Test data consistency after operations"""
        # Like a location
        self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': self.neighborhood.id
        })

        # Verify in different endpoints
        profile = self.client.get(reverse('user-get-user-profile'))
        favorites = self.client.get(
            reverse('get-user-favorites', kwargs={'user_id': self.user.id})
        )

        # Check consistency
        self.assertEqual(
            len(profile.data['liked_neighborhoods']), 
            len([f for f in favorites.data if f['favorite_neighborhood']])
        )

    def test_error_handling(self):
        """Test error handling"""
        # Test database connection error
        # TODO: Mock database connection failure

        # Test timeout scenarios
        # TODO: Mock timeout scenarios

        # Test concurrent modification
        # TODO: Test race conditions

    def test_get_user_profile(self):
        """Test getting user profile"""
        response = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['income'], '75000.00')
        self.assertEqual(response.data['city']['name'], 'Philadelphia')
        
    def test_like_location_flow(self):
        """Test the complete flow of liking and unliking different location types"""
        # Test liking a neighborhood
        response = self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': self.neighborhood.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('liked', response.data['message'])
        
        # Verify it appears in profile
        profile = self.client.get(reverse('user-get-user-profile'))
        self.assertEqual(len(profile.data['liked_neighborhoods']), 1)
        
        # Test unliking the neighborhood
        response = self.client.post(reverse('user-like-location'), {
            'type': 'neighborhood',
            'id': self.neighborhood.id
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('unliked', response.data['message'])
        
        # Test invalid location type
        response = self.client.post(reverse('user-like-location'), {
            'type': 'invalid',
            'id': 1
        })
        self.assertEqual(response.status_code, 400)

    def test_neighborhood_price_ranking(self):
        """Test neighborhood price ranking endpoint"""
        response = self.client.get(reverse('neighborhood-price-ranking'))
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_filter_neighborhoods(self):
        """Test neighborhood filtering with various parameters"""
        params = {
            'min_price': 100000,
            'max_price': 1000000,
            'max_crime': 30,
            'min_latitude': 39,
            'max_latitude': 40,
            'min_longitude': -76,
            'max_longitude': -75,
            'min_cost_of_living': 1000,
            'max_cost_of_living': 5000,
            'zip_code': '19104'
        }
        response = self.client.post(reverse('filter-neighborhoods'), params)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_count_natural_disasters(self):
        """Test natural disaster counting endpoint"""
        response = self.client.get(reverse('count-natural-disasters'))
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)

    def test_find_nearest_cities(self):
        """Test finding nearest cities endpoint"""
        params = {
            'latitude': 39.9526,
            'longitude': -75.1652,
            'num': 5
        }
        response = self.client.post(reverse('find-nearest-cities'), params)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
        if response.data:
            self.assertIn('distance_km', response.data[0])

    def test_preference_based_ranking(self):
        """Test preference-based ranking endpoint"""
        params = {
            'preferred_cost_of_living': 3000,
            'preferred_median_home_price': 500000,
            'preferred_median_income': 75000,
            'preferred_crime_rate': 20,
            'preferred_industry_income': 80000,
            'importance_cost_of_living': 1,
            'importance_median_home_price': 1,
            'importance_median_income': 1,
            'importance_crime_rate': 1,
            'importance_industry_income': 1,
            'num': 10
        }
        response = self.client.post(reverse('preference-based-ranking'), params)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)
