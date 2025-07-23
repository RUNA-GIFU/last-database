from .base import *

DATABASES = {
  'default' : {
    'ENGINE' : 'django.db.backends.mysql',
    'NAME' : 'app',
    'USER' : 'root',
    'PASSWORD' : 'password',
    'HOST' : 'host.docker.internal',
    'PORT' : '53306',
    'ATOMIC_REQUESTS' : True
  }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.inventory.authentication.CustomJWTAuthentication',  # ←正しいクラス名
    ],
}

