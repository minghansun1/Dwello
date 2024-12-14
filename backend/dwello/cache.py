import json
from typing import Any, Optional
import redis
from django.conf import settings

class RedisCache:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,
            decode_responses=True
        )
        
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            data = self.redis_client.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            print(f"Redis GET Error: {str(e)}")
            return None

    def set(self, key: str, value: Any, timeout: int = None) -> bool:
        """Set value in cache with optional timeout in seconds"""
        try:
            serialized_value = json.dumps(value)
            return self.redis_client.set(key, serialized_value, ex=timeout)
        except Exception as e:
            print(f"Redis SET Error: {str(e)}")
            return False

    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            print(f"Redis DELETE Error: {str(e)}")
            return False

    def clear_pattern(self, pattern: str) -> bool:
        """Clear all keys matching pattern"""
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return bool(self.redis_client.delete(*keys))
            return True
        except Exception as e:
            print(f"Redis CLEAR Pattern Error: {str(e)}")
            return False
