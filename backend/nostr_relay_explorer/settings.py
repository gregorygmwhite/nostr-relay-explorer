"""
Django settings for nostr_relay_explorer project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-0wk_v+_*py&st^$%a)leg!5wea23syv7r!y76wwoh0s@o!dh)c'

# SECURITY WARNING: don't run with debug turned on in production!
DJANGO_ENVIRONMENT = os.getenv("DJANGO_ENVIRONMENT")
TESTING = os.getenv("TESTING", default=False) == "true"
IS_LOCALHOST = DJANGO_ENVIRONMENT == "local"
IS_DEV = DJANGO_ENVIRONMENT == "dev"
IS_PRODUCTION = DJANGO_ENVIRONMENT == "production"
IS_STAGING = DJANGO_ENVIRONMENT == "staging"
IS_BUILD = DJANGO_ENVIRONMENT == "build"
DEBUG = IS_DEV or TESTING or IS_LOCALHOST

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'django_extensions',
    'huey.contrib.djhuey',
    'django_filters',
    'explorer',
    'meta',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'nostr_relay_explorer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'nostr_relay_explorer.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", default="postgres"),
        "USER": os.getenv("DB_USER", default="postgres"),
        "PASSWORD": os.getenv("DB_PASSWORD", default="postgres"),
        "HOST": os.getenv("DB_HOST", default="db"),
        "PORT": os.getenv("DB_PORT", default="5432"),
        "ATOMIC_REQUESTS": False,
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


FRONTEND_URL = os.getenv("FRONTEND_URL", default="http://localhost:3000")
BACKEND_DOMAIN = os.getenv("BACKEND_DOMAIN", default="localhost")
BACKEND_URL = f"http://{BACKEND_DOMAIN}:8000" if IS_LOCALHOST else f"https://{BACKEND_DOMAIN}"

CORS_ALLOWED_ORIGINS = [
    FRONTEND_URL,
]

CSRF_COOKIE_DOMAIN = BACKEND_DOMAIN
SESSION_COOKIE_DOMAIN = CSRF_COOKIE_DOMAIN
CSRF_TRUSTED_ORIGINS = [ BACKEND_URL ]

CSRF_COOKIE_SECURE = False if IS_LOCALHOST else True
SESSION_COOKIE_SECURE = False if IS_LOCALHOST else True

LOGIN_REDIRECT_URL = '/admin'
LOGOUT_REDIRECT_URL = '/admin'

HUEY = {
    "name": "main",
    # Task polling
    "huey_class": "huey.PriorityRedisExpireHuey",  # Prioritized tasks
    "immediate": False,
    "blocking": False,
    # Results
    "results": True,  # Store task results
    "store_none": False,  # Don't store result if None
    # Redis connection
    "connection": {
        "url": os.getenv("HUEY_REDIS_URL"),
        "read_timeout": 10,
    },
    # Consumer settings (single-queue)
    "consumer": {
        "workers": os.getenv("HUEY_CONSUMER_WORKER_COUNT",  1),
        "worker_type": "process",
        # Intervals
        "max_delay": 10,  # Maximum wait when polling
        "backoff": 1.15,  # Exponential rate for retrying failed tasks
        # Scheduled tasks
        "periodic": True,  # Enabled
        "scheduler_interval": 1,  # Check every second
        # Health check
        "check_worker_health": True,
        "health_check_interval": 10,
    },
}

if TESTING:  # Disable async when testing
    HUEY.update(
        {
            "immediate": True,  # Run tasks from the Django process
            "huey_class": "huey.FileHuey",  # Disable remote result storage
        }
    )
