from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

if os.getenv("USE_TEST_DB") == "true":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("TEST_DB_NAME", "dwello_test"),
            "USER": os.getenv("DEV_DB_USER"),
            "PASSWORD": os.getenv("DEV_DB_PASSWORD"),
            "HOST": os.getenv("DEV_DB_HOST", "localhost"),
            "PORT": os.getenv("DEV_DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("DEV_DB_NAME"),
            "USER": os.getenv("DEV_DB_USER"),
            "PASSWORD": os.getenv("DEV_DB_PASSWORD"),
            "HOST": os.getenv("DEV_DB_HOST"),
            "PORT": os.getenv("DEV_DB_PORT", "5432"),
        }
    }
