#!/usr/bin/env python
"""Script para verificar el estado de la base de datos"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')
django.setup()

from django.db import connection
from django.contrib.auth.models import User

print("=" * 50)
print("DIAGNÓSTICO DE BASE DE DATOS")
print("=" * 50)

# Verificar conexión
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Conexión exitosa a PostgreSQL: {version[0]}")
except Exception as e:
    print(f"❌ Error de conexión: {e}")
    exit(1)

# Verificar tablas
try:
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        print(f"\n📊 Tablas en la base de datos ({len(tables)}):")
        for table in tables:
            print(f"  - {table[0]}")
except Exception as e:
    print(f"❌ Error listando tablas: {e}")

# Verificar tabla auth_user específicamente
try:
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'auth_user'
            );
        """)
        exists = cursor.fetchone()[0]
        if exists:
            print(f"\n✅ Tabla 'auth_user' existe")
            cursor.execute("SELECT COUNT(*) FROM auth_user;")
            count = cursor.fetchone()[0]
            print(f"   Usuarios registrados: {count}")
        else:
            print(f"\n❌ Tabla 'auth_user' NO existe")
except Exception as e:
    print(f"❌ Error verificando auth_user: {e}")

# Verificar migraciones aplicadas
try:
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'django_migrations'
            );
        """)
        exists = cursor.fetchone()[0]
        if exists:
            cursor.execute("SELECT COUNT(*) FROM django_migrations;")
            count = cursor.fetchone()[0]
            print(f"\n✅ Tabla 'django_migrations' existe")
            print(f"   Migraciones aplicadas: {count}")
            
            if count > 0:
                cursor.execute("""
                    SELECT app, name 
                    FROM django_migrations 
                    ORDER BY applied DESC 
                    LIMIT 5;
                """)
                recent = cursor.fetchall()
                print(f"\n   Últimas 5 migraciones:")
                for app, name in recent:
                    print(f"     - {app}.{name}")
        else:
            print(f"\n❌ Tabla 'django_migrations' NO existe")
            print("   ⚠️  Las migraciones NUNCA se han aplicado")
except Exception as e:
    print(f"❌ Error verificando migraciones: {e}")

print("\n" + "=" * 50)
