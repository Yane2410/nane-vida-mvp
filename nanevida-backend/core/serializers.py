from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Entry, SOSResource, UserProfile
import bleach
import re


def sanitize_text(value):
    """
    Sanitización avanzada para prevenir XSS.
    - Elimina todos los tags HTML
    - Bloquea esquemas peligrosos (javascript:, data:, vbscript:)
    - Remueve eventos HTML (onclick, onerror, etc.)
    """
    if not value:
        return value
    
    # Primero, usar bleach para limpiar HTML
    cleaned = bleach.clean(value, tags=[], strip=True)
    
    # Bloquear esquemas peligrosos
    dangerous_schemes = [
        r'javascript\s*:',
        r'data\s*:',
        r'vbscript\s*:',
        r'file\s*:',
        r'about\s*:',
    ]
    
    for scheme in dangerous_schemes:
        cleaned = re.sub(scheme, '', cleaned, flags=re.IGNORECASE)
    
    # Bloquear atributos de eventos HTML
    event_attrs = r'on\w+\s*='
    cleaned = re.sub(event_attrs, '', cleaned, flags=re.IGNORECASE)
    
    return cleaned


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'email', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_bio(self, value):
        """Sanitizar bio para prevenir XSS"""
        return sanitize_text(value)


class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'title', 'content', 'emoji', 'mood', 'created_at', 'updated_at']
    
    def validate_title(self, value):
        """Sanitizar título para prevenir XSS"""
        return sanitize_text(value)
    
    def validate_content(self, value):
        """Sanitizar contenido para prevenir XSS"""
        return sanitize_text(value)

class SOSResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSResource
        fields = ['id', 'title', 'type', 'url', 'priority', 'active']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirmar contraseña")
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Este correo ya está registrado."})
        
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Este nombre de usuario ya está en uso."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
