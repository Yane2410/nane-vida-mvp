#!/usr/bin/env python
"""Script para verificar DATABASE_URL en tiempo de ejecución"""
import os
import sys

DATABASE_URL = os.environ.get("DATABASE_URL", "")

print("=" * 70)
print("VERIFICACIÓN DE DATABASE_URL EN TIEMPO DE EJECUCIÓN")
print("=" * 70)

if not DATABASE_URL:
    print("❌ DATABASE_URL no está configurado!")
    sys.exit(1)

# Mostrar información de la URL sin exponer credenciales
if "neon.tech" in DATABASE_URL:
    print("✅ DATABASE_URL apunta a Neon PostgreSQL (correcto)")
    if "neondb_owner" in DATABASE_URL:
        print("✅ Usuario: neondb_owner")
    if "ep-twilight-wildflower" in DATABASE_URL:
        print("✅ Endpoint: ep-twilight-wildflower (correcto)")
elif "railway" in DATABASE_URL or "postgres" in DATABASE_URL:
    print("⚠️  DATABASE_URL puede estar apuntando a Railway PostgreSQL (incorrecto)")
    print(f"   URL: {DATABASE_URL[:50]}...")
else:
    print(f"⚠️  DATABASE_URL desconocido: {DATABASE_URL[:50]}...")

print("=" * 70)
