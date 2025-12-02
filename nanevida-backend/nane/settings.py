"""
Django settings for NANE VIDA project.
Enhanced with Security by Default and Security by Design principles.
"""

import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

# Load .env file if exists (for local development)
from dotenv import load_dotenv

# === Directorios base ===
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

# === Seguridad / entorno ===
# CRITICAL: En producción SIEMPRE define estas variables
SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    if os.environ.get("DJANGO_ENV") == "production":
        raise ValueError("SECRET_KEY must be set in production!")
    SECRET_KEY = "dev-insecure-key-CHANGE-IN-PRODUCTION"
    print("⚠️  WARNING: Using insecure SECRET_KEY for development!")

# DEBUG: Never use True in production
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"
if DEBUG and os.environ.get("DJANGO_ENV") == "production":
    raise ValueError("DEBUG cannot be True in production!")

# Environment detection
DJANGO_ENV = os.environ.get("DJANGO_ENV", "development")
IS_PRODUCTION = DJANGO_ENV == "production"
IS_DEVELOPMENT = DJANGO_ENV == "development"

# Allowed Hosts - Security Critical
ALLOWED_HOSTS_STR = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1")
ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS_STR.split(",") if h.strip()]
if IS_PRODUCTION and not ALLOWED_HOSTS:
    raise ValueError("ALLOWED_HOSTS must be configured in production!")

# Dominios/URLs del frontend y backend para CORS/CSRF
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "")
BACKEND_ORIGIN = os.environ.get("BACKEND_ORIGIN", "")

# === Apps instaladas ===
INSTALLED_APPS = [
    # Terceros - Security & CORS first
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "csp",  # Content Security Policy

    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Tu app
    "core",
]

# === Middleware ===
# Orden crítico para seguridad
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "csp.middleware.CSPMiddleware",
]

ROOT_URLCONF = "nane.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "nane.wsgi.application"

# === Base de datos ===
# Configuración genérica que soporta múltiples bases de datos
DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()

if DATABASE_URL:
    # Si existe DATABASE_URL, usar dj-database-url para parsearla
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
elif IS_PRODUCTION:
    # En producción, DATABASE_URL es obligatorio
    raise ValueError("DATABASE_URL must be set in production! Check Railway environment variables.")
else:
    # Configuración manual desde variables individuales (desarrollo)
    DB_ENGINE = os.environ.get("DB_ENGINE", "django.db.backends.sqlite3")
    DB_NAME = os.environ.get("DB_NAME", str(BASE_DIR / "db.sqlite3"))

    DATABASES = {
        "default": {
            "ENGINE": DB_ENGINE,
            "NAME": DB_NAME,
        }
    }

    # Si no es SQLite, agregar configuraciones adicionales
    if DB_ENGINE != "django.db.backends.sqlite3":
        DATABASES["default"].update({
            "USER": os.environ.get("DB_USER", ""),
            "PASSWORD": os.environ.get("DB_PASSWORD", ""),
            "HOST": os.environ.get("DB_HOST", "localhost"),
            "PORT": os.environ.get("DB_PORT", "5432"),
            "CONN_MAX_AGE": 600,
            "CONN_HEALTH_CHECKS": True,
            "OPTIONS": {
                "connect_timeout": 10,
            }
        })

# Database Security Options
if IS_PRODUCTION:
    # Require SSL in production for PostgreSQL/MySQL
    db_engine = DATABASES["default"]["ENGINE"]
    if db_engine in ["django.db.backends.postgresql",
                     "django.db.backends.mysql"]:
        DATABASES["default"].setdefault("OPTIONS", {})
        DATABASES["default"]["OPTIONS"]["sslmode"] = "require"

# === Password Hashing (Argon2 - más seguro que PBKDF2) ===
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

# === Password validators ===
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation."
                "UserAttributeSimilarityValidator"
    },
    {
        "NAME": "django.contrib.auth.password_validation."
                "MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 10,
        }
    },
    {
        "NAME": "django.contrib.auth.password_validation."
                "CommonPasswordValidator"
    },
    {
        "NAME": "django.contrib.auth.password_validation."
                "NumericPasswordValidator"
    },
]

# === Internacionalización ===
LANGUAGE_CODE = "es-mx"
TIME_ZONE = "America/Mexico_City"
USE_I18N = True
USE_TZ = True

# === Archivos estáticos ===
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = (
    "whitenoise.storage.CompressedManifestStaticFilesStorage"
)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# === DRF Configuration ===
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "20/min",
        "user": "100/min",
    },
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}

# Habilitar browsable API solo en desarrollo
if IS_DEVELOPMENT:
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"].append(
        "rest_framework.renderers.BrowsableAPIRenderer"
    )

# === JWT Configuration ===
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.environ.get("JWT_ACCESS_LIFETIME_MINUTES", "15"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.environ.get("JWT_REFRESH_LIFETIME_DAYS", "7"))
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "JTI_CLAIM": "jti",
}

# === CORS Configuration ===
CORS_ALLOWED_ORIGINS = []

if IS_DEVELOPMENT:
    CORS_ALLOWED_ORIGINS.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ])

if FRONTEND_ORIGIN:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_ORIGIN)

# Permitir todos los subdominios de Vercel para deployments preview
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.vercel\.app$",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-request-time",
]

# === CSRF Configuration ===
CSRF_TRUSTED_ORIGINS = []

if IS_DEVELOPMENT:
    CSRF_TRUSTED_ORIGINS.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ])

if FRONTEND_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_ORIGIN)
if BACKEND_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(BACKEND_ORIGIN)

# Permitir subdominios de Vercel en CSRF
CSRF_TRUSTED_ORIGINS.extend([
    "https://*.vercel.app",
])


# === Content Security Policy (CSP) - django-csp 4.0+ format ===
CONTENT_SECURITY_POLICY = {
    'DIRECTIVES': {
        'default-src': ("'self'",),
        'script-src': ("'self'",),
        'style-src': ("'self'", "'unsafe-inline'"),
        'img-src': ("'self'", "data:", "https:"),
        'font-src': ("'self'",),
        'connect-src': ("'self'",),
        'frame-ancestors': ("'none'",),
        'base-uri': ("'self'",),
        'form-action': ("'self'",),
    }
}

# === Security Headers & Settings ===
# Session Security
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_AGE = 1209600  # 2 semanas

# CSRF Security
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = not DEBUG
CSRF_USE_SESSIONS = False

# Security Headers (activadas en producción)
if not DEBUG:
    # XSS Protection
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True

    # SSL/HTTPS
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # HSTS (HTTP Strict Transport Security)
    # Descomenta cuando HTTPS esté 100% estable
    # SECURE_HSTS_SECONDS = 31536000  # 1 año
    # SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    # SECURE_HSTS_PRELOAD = True

    # Secure Proxy SSL Header (para Render, Heroku, etc.)
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

    # X-Frame-Options
    X_FRAME_OPTIONS = "DENY"

# === Logging Configuration ===
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO" if IS_PRODUCTION else "DEBUG",
    },
    "loggers": {
        "django.security": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "INFO" if IS_PRODUCTION else "DEBUG",
            "propagate": False,
        },
    },
}

# === Media Files (User Uploads) ===
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'mediafiles'
