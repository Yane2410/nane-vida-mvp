#!/usr/bin/env python
"""Script para crear entradas de prueba con diferentes moods"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nane.settings')
django.setup()

from core.models import Entry
from django.contrib.auth.models import User

user = User.objects.get(username='admin')

entradas = [
    {'title': 'Dia tranquilo', 'content': 'Un dia normal, sin mucho que destacar', 'mood': 'neutral'},
    {'title': 'Presentacion', 'content': 'Nervioso por la presentacion de manana', 'mood': 'anxious'},
    {'title': 'Gran dia', 'content': 'Todo salio perfecto hoy!', 'mood': 'happy'},
    {'title': 'Dia dificil', 'content': 'Fue un dia complicado', 'mood': 'sad'},
    {'title': 'Super feliz', 'content': 'Recibi excelentes noticias!', 'mood': 'very_happy'},
]

for e in entradas:
    Entry.objects.create(owner=user, **e)
    print(f"✅ Creada: {e['title']} ({e['mood']})")

print(f"\n📊 Total de entradas: {Entry.objects.filter(owner=user).count()}")
