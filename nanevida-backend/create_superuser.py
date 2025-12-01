"""
Script para crear superuser en producción
Ejecutar una vez con: python create_superuser.py
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

# Credenciales del superuser
username = os.environ.get('ADMIN_USERNAME', 'admin')
email = os.environ.get('ADMIN_EMAIL', 'admin@nanevida.com')
password = os.environ.get('ADMIN_PASSWORD', 'NaneVida2024!')

try:
    # Intentar crear superuser
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        print(f'✅ Superuser "{username}" creado exitosamente!')
        print(f'   Email: {email}')
        print(f'   Password: {password}')
    else:
        print(f'⚠️  El usuario "{username}" ya existe.')
        # Actualizar contraseña por si acaso
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f'✅ Contraseña del usuario "{username}" actualizada.')
except IntegrityError as e:
    print(f'❌ Error de integridad al crear usuario: {e}')
    sys.exit(0)  # No fallar el deploy
except Exception as e:
    print(f'❌ Error inesperado: {e}')
    sys.exit(0)  # No fallar el deploy
