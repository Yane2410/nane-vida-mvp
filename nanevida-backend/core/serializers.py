from rest_framework import serializers
from .models import Entry, SOSResource

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'title', 'content', 'emoji', 'created_at', 'updated_at']

class SOSResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSResource
        fields = ['id', 'title', 'type', 'url', 'priority', 'active']
