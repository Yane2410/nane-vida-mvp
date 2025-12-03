"""
Garden API Serializers
"""
from rest_framework import serializers
from .garden_models import (
    GardenProfile, FlowerType, Plant, 
    WellnessActivity, Milestone
)


class FlowerTypeSerializer(serializers.ModelSerializer):
    """Serializer for flower types"""
    class Meta:
        model = FlowerType
        fields = ['id', 'activity_type', 'flower_name', 'flower_emoji', 'color', 'description']


class PlantSerializer(serializers.ModelSerializer):
    """Serializer for individual plants"""
    flower = FlowerTypeSerializer(source='flower_type', read_only=True)
    stage_emoji = serializers.SerializerMethodField()
    days_old = serializers.SerializerMethodField()
    
    class Meta:
        model = Plant
        fields = [
            'id', 'flower', 'growth_stage', 'times_watered',
            'planted_date', 'bloomed_date', 'position_x', 'position_y',
            'stage_emoji', 'days_old'
        ]
    
    def get_stage_emoji(self, obj):
        return obj.get_stage_emoji()
    
    def get_days_old(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.planted_date).days


class WellnessActivitySerializer(serializers.ModelSerializer):
    """Serializer for wellness activities"""
    plant_info = PlantSerializer(source='plant', read_only=True)
    
    class Meta:
        model = WellnessActivity
        fields = [
            'id', 'activity_type', 'duration_minutes',
            'completed_at', 'notes', 'plant_info'
        ]


class MilestoneSerializer(serializers.ModelSerializer):
    """Serializer for milestones"""
    class Meta:
        model = Milestone
        fields = [
            'id', 'milestone_type', 'title', 'description',
            'icon', 'achieved_at', 'is_viewed'
        ]


class GardenProfileSerializer(serializers.ModelSerializer):
    """Serializer for garden profile"""
    recent_plants = serializers.SerializerMethodField()
    recent_activities = serializers.SerializerMethodField()
    unviewed_milestones = serializers.SerializerMethodField()
    garden_age_days = serializers.SerializerMethodField()
    blooming_plants = serializers.SerializerMethodField()
    
    class Meta:
        model = GardenProfile
        fields = [
            'id', 'total_plants', 'current_month_plants',
            'total_mindful_minutes', 'current_gentle_streak',
            'longest_gentle_streak', 'last_practice_date',
            'garden_started', 'garden_age_days',
            'recent_plants', 'recent_activities', 'unviewed_milestones',
            'blooming_plants'
        ]
    
    def get_recent_plants(self, obj):
        plants = obj.plants.all()[:10]
        return PlantSerializer(plants, many=True).data
    
    def get_recent_activities(self, obj):
        activities = obj.activities.all()[:10]
        return WellnessActivitySerializer(activities, many=True).data
    
    def get_unviewed_milestones(self, obj):
        milestones = obj.milestones.filter(is_viewed=False)
        return MilestoneSerializer(milestones, many=True).data
    
    def get_garden_age_days(self, obj):
        from django.utils import timezone
        return (timezone.now() - obj.garden_started).days
    
    def get_blooming_plants(self, obj):
        return obj.plants.filter(growth_stage='blooming').count()


class GardenStatsSerializer(serializers.Serializer):
    """Serializer for garden statistics"""
    total_plants = serializers.IntegerField()
    plants_by_type = serializers.DictField()
    monthly_activity = serializers.ListField()
    weekly_summary = serializers.DictField()
    growth_over_time = serializers.ListField()
