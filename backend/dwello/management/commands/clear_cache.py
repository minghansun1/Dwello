from django.core.management.base import BaseCommand
from dwello.cache import RedisCache

class Command(BaseCommand):
    help = 'Clears the Redis cache'

    def handle(self, *args, **kwargs):
        redis_cache = RedisCache()
        redis_cache.clear_all()
        self.stdout.write(self.style.SUCCESS('Successfully cleared cache'))