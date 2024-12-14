from functools import wraps
from rest_framework.response import Response
from .cache import RedisCache

redis_cache = RedisCache()

def cache_response(timeout=None, key_prefix=''):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # For top_liked endpoints, include location type in cache key
            if key_prefix == 'top_liked':
                location_type = request.GET.get('type', '')
                cache_key = f"{key_prefix}:{location_type}"
            else:
                cache_key = key_prefix

            # Add other query parameters to cache key
            other_params = {k: v for k, v in request.GET.items() if k != 'type'}
            if other_params:
                cache_key += f":{hash(frozenset(other_params.items()))}"
            
            # Try to get from cache
            cached_response = redis_cache.get(cache_key)
            if cached_response is not None:
                return Response(cached_response)
            
            # If not in cache, execute view
            response = view_func(request, *args, **kwargs)
            
            # Cache the response
            if response.status_code == 200:
                redis_cache.set(
                    cache_key, 
                    response.data, 
                    timeout=timeout
                )
            
            return response
        return wrapper
    return decorator
