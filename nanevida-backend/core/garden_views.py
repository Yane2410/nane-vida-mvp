"""
Garden API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import datetime, timedelta
import random

from .garden_models import (
    GardenProfile, FlowerType, Plant,
    WellnessActivity, Milestone, FLOWER_TYPES_DATA
)
from .garden_serializers import (
    GardenProfileSerializer, FlowerTypeSerializer,
    PlantSerializer, WellnessActivitySerializer,
    MilestoneSerializer, GardenStatsSerializer
)


class GardenViewSet(viewsets.ViewSet):
    """
    ViewSet for Garden of Wellness
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Get user's garden profile"""
        garden, created = GardenProfile.objects.get_or_create(user=request.user)
        
        if created:
            # Initialize flower types if first time
            self._initialize_flower_types()
        
        # Check for monthly reset
        garden.check_monthly_reset()
        
        serializer = GardenProfileSerializer(garden)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def plant_seed(self, request):
        """
        Plant a new seed after completing an activity
        Expected data: {
            "activity_type": "breath",
            "duration_minutes": 5
        }
        """
        garden, _ = GardenProfile.objects.get_or_create(user=request.user)
        activity_type = request.data.get('activity_type')
        duration_minutes = request.data.get('duration_minutes', 0)
        
        if not activity_type:
            return Response(
                {'error': 'activity_type is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create flower type
        flower_type = FlowerType.objects.filter(activity_type=activity_type).first()
        if not flower_type:
            return Response(
                {'error': 'Invalid activity_type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if plant of this type already exists and is not fully bloomed
        existing_plant = garden.plants.filter(
            flower_type=flower_type,
            growth_stage__in=['seed', 'sprout', 'growing']
        ).first()
        
        if existing_plant:
            # Water existing plant instead of planting new one
            existing_plant.water()
            plant = existing_plant
            message = f"Regaste tu {flower_type.flower_name} {flower_type.flower_emoji}"
        else:
            # Plant new seed
            # Random position in garden
            position_x = random.randint(10, 90)
            position_y = random.randint(10, 90)
            
            plant = Plant.objects.create(
                garden=garden,
                flower_type=flower_type,
                position_x=position_x,
                position_y=position_y
            )
            message = f"Plantaste una semilla de {flower_type.flower_name} {flower_type.flower_emoji}"
        
        # Log activity
        activity = WellnessActivity.objects.create(
            garden=garden,
            activity_type=activity_type,
            duration_minutes=duration_minutes,
            plant=plant
        )
        
        # Update garden stats
        garden.total_plants = garden.plants.count()
        garden.current_month_plants = garden.plants.filter(
            planted_date__month=timezone.now().month,
            planted_date__year=timezone.now().year
        ).count()
        garden.total_mindful_minutes += duration_minutes
        garden.update_streak()
        garden.save()
        
        # Check for milestones
        self._check_milestones(garden)
        
        # Get updated garden
        serializer = GardenProfileSerializer(garden)
        
        return Response({
            'message': message,
            'plant': PlantSerializer(plant).data,
            'garden': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get garden statistics"""
        garden, _ = GardenProfile.objects.get_or_create(user=request.user)
        
        # Plants by type
        plants_by_type = {}
        for flower_type in FlowerType.objects.all():
            count = garden.plants.filter(flower_type=flower_type).count()
            if count > 0:
                plants_by_type[flower_type.flower_name] = {
                    'count': count,
                    'emoji': flower_type.flower_emoji,
                    'color': flower_type.color
                }
        
        # Monthly activity (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        monthly_activity = []
        for i in range(30):
            date = (timezone.now() - timedelta(days=29-i)).date()
            activity_count = garden.activities.filter(
                completed_at__date=date
            ).count()
            monthly_activity.append({
                'date': date.isoformat(),
                'count': activity_count
            })
        
        # Weekly summary
        week_ago = timezone.now() - timedelta(days=7)
        weekly_activities = garden.activities.filter(completed_at__gte=week_ago)
        weekly_summary = {
            'total_activities': weekly_activities.count(),
            'total_minutes': weekly_activities.aggregate(
                total=Sum('duration_minutes')
            )['total'] or 0,
            'plants_this_week': garden.plants.filter(
                planted_date__gte=week_ago
            ).count()
        }
        
        # Growth over time (plants per month for last 6 months)
        growth_over_time = []
        for i in range(6):
            date = timezone.now() - timedelta(days=30*i)
            month_plants = garden.plants.filter(
                planted_date__month=date.month,
                planted_date__year=date.year
            ).count()
            growth_over_time.insert(0, {
                'month': date.strftime('%B'),
                'plants': month_plants
            })
        
        stats_data = {
            'total_plants': garden.total_plants,
            'plants_by_type': plants_by_type,
            'monthly_activity': monthly_activity,
            'weekly_summary': weekly_summary,
            'growth_over_time': growth_over_time
        }
        
        serializer = GardenStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def milestones(self, request):
        """Get user's milestones"""
        garden, _ = GardenProfile.objects.get_or_create(user=request.user)
        milestones = garden.milestones.all()
        serializer = MilestoneSerializer(milestones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def mark_milestone_viewed(self, request):
        """Mark milestone as viewed"""
        milestone_id = request.data.get('milestone_id')
        if not milestone_id:
            return Response(
                {'error': 'milestone_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            milestone = Milestone.objects.get(
                id=milestone_id,
                garden__user=request.user
            )
            milestone.is_viewed = True
            milestone.save()
            return Response({'success': True})
        except Milestone.DoesNotExist:
            return Response(
                {'error': 'Milestone not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def flower_types(self, request):
        """Get all flower types"""
        flower_types = FlowerType.objects.all()
        serializer = FlowerTypeSerializer(flower_types, many=True)
        return Response(serializer.data)
    
    def _initialize_flower_types(self):
        """Initialize default flower types"""
        for flower_data in FLOWER_TYPES_DATA:
            FlowerType.objects.get_or_create(
                activity_type=flower_data['activity_type'],
                defaults=flower_data
            )
    
    def _check_milestones(self, garden):
        """Check and create milestones"""
        milestones_to_check = []
        
        # First plant
        if garden.total_plants == 1:
            milestones_to_check.append({
                'type': 'first_plant',
                'title': '🌱 Primera Semilla',
                'description': 'Plantaste tu primera semilla de bienestar',
                'icon': '🌱'
            })
        
        # First bloom
        if garden.plants.filter(growth_stage='blooming').count() == 1:
            milestones_to_check.append({
                'type': 'first_bloom',
                'title': '🌸 Primera Flor',
                'description': 'Tu primera planta ha florecido con tu constancia',
                'icon': '🌸'
            })
        
        # Gentle streaks
        if garden.current_gentle_streak == 7:
            milestones_to_check.append({
                'type': '7_days',
                'title': '✨ Una Semana de Autocuidado',
                'description': '7 días nutriendo tu bienestar',
                'icon': '✨'
            })
        elif garden.current_gentle_streak == 15:
            milestones_to_check.append({
                'type': '15_days',
                'title': '🌟 Dos Semanas de Práctica',
                'description': '15 días cultivando tu jardín interior',
                'icon': '🌟'
            })
        elif garden.current_gentle_streak == 30:
            milestones_to_check.append({
                'type': '30_days',
                'title': '💫 Un Mes de Constancia',
                'description': '30 días de amor propio y cuidado',
                'icon': '💫'
            })
        
        # Plant milestones
        if garden.total_plants == 10:
            milestones_to_check.append({
                'type': '10_plants',
                'title': '🌿 Pequeño Jardín',
                'description': '10 plantas creciendo en tu jardín',
                'icon': '🌿'
            })
        elif garden.total_plants == 25:
            milestones_to_check.append({
                'type': '25_plants',
                'title': '🌻 Jardín Floreciente',
                'description': '25 plantas testimonio de tu dedicación',
                'icon': '🌻'
            })
        elif garden.total_plants == 50:
            milestones_to_check.append({
                'type': '50_plants',
                'title': '🌺 Jardín Abundante',
                'description': '50 plantas, un verdadero santuario',
                'icon': '🌺'
            })
        elif garden.total_plants == 100:
            milestones_to_check.append({
                'type': '100_plants',
                'title': '🎋 Jardín Zen',
                'description': '100 plantas, maestría en autocuidado',
                'icon': '🎋'
            })
        
        # Time milestones
        if garden.total_mindful_minutes >= 60 and garden.total_mindful_minutes < 120:
            milestones_to_check.append({
                'type': '1_hour',
                'title': '⏰ Primera Hora',
                'description': '60 minutos dedicados a ti mismo',
                'icon': '⏰'
            })
        elif garden.total_mindful_minutes >= 600:
            milestones_to_check.append({
                'type': '10_hours',
                'title': '⏳ 10 Horas de Autocuidado',
                'description': '600 minutos de amor propio',
                'icon': '⏳'
            })
        
        # Create milestones
        for milestone_data in milestones_to_check:
            Milestone.objects.get_or_create(
                garden=garden,
                milestone_type=milestone_data['type'],
                defaults={
                    'title': milestone_data['title'],
                    'description': milestone_data['description'],
                    'icon': milestone_data['icon']
                }
            )
