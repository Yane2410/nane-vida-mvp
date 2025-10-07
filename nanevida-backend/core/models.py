from django.db import models
from django.contrib.auth.models import User

class Entry(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=120)
    content = models.TextField()
    emoji = models.CharField(max_length=10, blank=True, default='')
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
