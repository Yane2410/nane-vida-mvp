import os
from pathlib import Path

# === Directorios base ===
BASE_DIR = Path(__file__).resolve().parent.parent

# === Seguridad / entorno ===
# En producción (Render) define estas variables en el panel de Environment:
# SECRET_KEY, DEBUG=False, ALLOWED_HOSTS, FRONTEND_ORIGIN, BACKEND_ORIGIN (opcional)
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-inseguro-no-usar-en-produccion")
DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h.strip()]

# Dominios/URLs del frontend y backend para CORS/CSRF
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "")  # p.ej. https://nane-vida-frontend.vercel.app
BACKEND_ORIGIN = os.environ.get("BACKEND_ORIGIN", "")    # p.ej. https://tu-backend.onrender.com

# === Apps instaladas ===
INSTALLED_APPS = [
    # Terceros
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",

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
# Orden recomendado: Security -> WhiteNoise -> Cors -> Common -> CSRF -> ...
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",    # sirve estáticos en prod
    "corsheaders.middleware.CorsMiddleware",         # CORS antes de CommonMiddleware
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
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
# Para MVP en Render puedes usar SQLite; para persistencia real, cambiamos a Postgres luego.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# === Password validators ===
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# === Internacionalización (deja por defecto si no necesitas cambiar) ===
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# === Archivos estáticos (Admin + WhiteNoise) ===
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# === DRF / JWT / Throttling ===
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
        "user": "60/min",
    },
}

# === CORS / CSRF ===
# En desarrollo permitimos la SPA local; en prod añadimos Vercel/Render por variables
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
if FRONTEND_ORIGIN:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_ORIGIN)

CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]
if FRONTEND_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(FRONTEND_ORIGIN)
if BACKEND_ORIGIN:
    CSRF_TRUSTED_ORIGINS.append(BACKEND_ORIGIN)

# Opcionales “best practices” cuando DEBUG=False
if not DEBUG:
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # Cuando tengas HTTPS estable, puedes activar:
    # SECURE_HSTS_SECONDS = 31536000
    # SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    # SECURE_HSTS_PRELOAD = True
