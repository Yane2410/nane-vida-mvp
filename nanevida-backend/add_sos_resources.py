#!/usr/bin/env python
"""Script para agregar recursos SOS de Chile"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')
django.setup()

from core.models import SOSResource

# Recursos SOS para Chile
recursos = [
    {
        'title': 'Salud Responde 600 360 7777',
        'type': 'CALL',
        'url': 'tel:6003607777',
        'priority': 1,
        'active': True
    },
    {
        'title': 'Prevención Suicidio *4141',
        'type': 'CALL',
        'url': 'tel:*4141',
        'priority': 2,
        'active': True
    },
    {
        'title': 'Fono Drogas 1412',
        'type': 'CALL',
        'url': 'tel:1412',
        'priority': 3,
        'active': True
    },
    {
        'title': 'Todo Mejora - Apoyo LGBTQ+',
        'type': 'LINK',
        'url': 'https://todomejora.org/',
        'priority': 4,
        'active': True
    },
    {
        'title': 'Apoyo víctimas de abuso - 800 730 800',
        'type': 'CALL',
        'url': 'tel:800730800',
        'priority': 5,
        'active': True
    },
    {
        'title': 'Centros de Salud Mental Comunitaria',
        'type': 'LINK',
        'url': 'https://www.minsal.cl/salud-mental/',
        'priority': 6,
        'active': True
    },
    {
        'title': 'Carabineros 133',
        'type': 'CALL',
        'url': 'tel:133',
        'priority': 7,
        'active': True
    }
]

print("=" * 60)
print("AGREGANDO RECURSOS SOS DE CHILE")
print("=" * 60)

# Limpiar recursos existentes (opcional)
existing_count = SOSResource.objects.count()
if existing_count > 0:
    print(f"⚠️  Ya existen {existing_count} recursos. Los eliminaremos primero...")
    SOSResource.objects.all().delete()
    print("✅ Recursos anteriores eliminados")

# Agregar nuevos recursos
created_count = 0
for recurso in recursos:
    try:
        obj, created = SOSResource.objects.get_or_create(
            title=recurso['title'],
            defaults=recurso
        )
        if created:
            print(f"✅ Creado: {recurso['title']} ({recurso['type']})")
            created_count += 1
        else:
            print(f"ℹ️  Ya existe: {recurso['title']}")
    except Exception as e:
        print(f"❌ Error al crear {recurso['title']}: {e}")

print("=" * 60)
print(f"✅ Proceso completado. {created_count} recursos creados.")
print(f"📊 Total de recursos SOS: {SOSResource.objects.count()}")
print("=" * 60)
print("\n🌐 Verifica los recursos en:")
print("   Frontend: https://nane-vida-mvp-2d9j.vercel.app/sos")
print("   Admin: https://nane-vida-mvp-production.up.railway.app/admin")
