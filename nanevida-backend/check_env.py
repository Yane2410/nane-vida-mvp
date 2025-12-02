#!/usr/bin/env python
"""Script para verificar variables de entorno"""
import os

print("=" * 50)
print("VARIABLES DE ENTORNO")
print("=" * 50)

# Variables críticas
critical_vars = [
    'DATABASE_URL',
    'DJANGO_ENV',
    'SECRET_KEY',
    'FRONTEND_ORIGIN',
    'ALLOWED_HOSTS',
]

for var in critical_vars:
    value = os.environ.get(var, '')
    if var == 'SECRET_KEY' and value:
        # Ocultar la clave secreta
        print(f"{var}: {value[:10]}...{value[-10:]}")
    elif var == 'DATABASE_URL' and value:
        # Mostrar solo el host de la base de datos
        if 'neon.tech' in value:
            print(f"{var}: ✅ Neon PostgreSQL configurado")
        else:
            print(f"{var}: {value[:50]}...")
    elif value:
        print(f"{var}: {value}")
    else:
        print(f"{var}: ❌ NO CONFIGURADO")

print("\n" + "=" * 50)
