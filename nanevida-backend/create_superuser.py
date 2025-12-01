"""
Script para crear superuser en producción
Ejecutar una vez con: python create_superuser.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Credenciales del superuser
username = os.environ.get('ADMIN_USERNAME', 'admin')
email = os.environ.get('ADMIN_EMAIL', 'admin@nanevida.com')
password = os.environ.get('ADMIN_PASSWORD', 'NaneVida2024!')

# Crear superuser solo si no existe
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'✅ Superuser "{username}" creado exitosamente!')
    print(f'   Email: {email}')
    print(f'   Password: {password}')
else:
    print(f'⚠️  El usuario "{username}" ya existe.')
