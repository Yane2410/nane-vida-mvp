from django.db import models
from django.contrib.auth.models import User

# Import Garden models
from .garden_models import (
    GardenProfile, FlowerType, Plant, 
    WellnessActivity, Milestone
)


class UserProfile(models.Model):
    """Perfil extendido del usuario con foto y descripción"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"


class Entry(models.Model):
    MOOD_CHOICES = [
        ('very_happy', '😊 Muy feliz'),
        ('happy', '🙂 Feliz'),
        ('neutral', '😐 Neutral'),
        ('sad', '😢 Triste'),
        ('anxious', '😰 Ansioso/a'),
        ('angry', '😡 Enojado/a'),
    ]
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=120)
    content = models.TextField()
    emoji = models.CharField(max_length=10, blank=True, default='')
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.owner.username})"

class SOSResource(models.Model):
    TYPE_CHOICES = [
        ('CALL', 'Llamar'),
        ('LINK', 'Enlace'),
        ('TEXT', 'Texto'),
    ]
    title = models.CharField(max_length=120)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='LINK')
    url = models.URLField(blank=True)
    priority = models.IntegerField(default=1)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
