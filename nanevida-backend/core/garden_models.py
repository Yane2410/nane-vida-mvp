"""
Garden of Wellness - Gamification System
Mindful approach to user engagement without pressure
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta


class GardenProfile(models.Model):
    """User's garden profile - their wellness journey"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='garden')
    
    # Garden stats
    total_plants = models.IntegerField(default=0)
    current_month_plants = models.IntegerField(default=0)
    
    # Time dedicated to self-care (in minutes)
    total_mindful_minutes = models.IntegerField(default=0)
    
    # Gentle streak tracking (no pressure)
    current_gentle_streak = models.IntegerField(default=0)
    longest_gentle_streak = models.IntegerField(default=0)
    last_practice_date = models.DateField(null=True, blank=True)
    
    # Garden started date
    garden_started = models.DateTimeField(auto_now_add=True)
    
    # Monthly reset tracking
    last_reset_month = models.IntegerField(default=0)
    last_reset_year = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Garden Profile"
        verbose_name_plural = "Garden Profiles"
    
    def __str__(self):
        return f"{self.user.username}'s Garden - {self.total_plants} plants"
    
    def check_monthly_reset(self):
        """Reset monthly counter if new month"""
        now = timezone.now()
        if now.month != self.last_reset_month or now.year != self.last_reset_year:
            self.current_month_plants = 0
            self.last_reset_month = now.month
            self.last_reset_year = now.year
            self.save()
    
    def update_streak(self, practice_date=None):
        """Update gentle streak without pressure"""
        if practice_date is None:
            practice_date = timezone.now().date()
        
        if self.last_practice_date:
            days_diff = (practice_date - self.last_practice_date).days
            
            if days_diff == 1:
                # Consecutive day
                self.current_gentle_streak += 1
            elif days_diff == 0:
                # Same day, no change
                pass
            else:
                # Gap in practice - gentle restart
                self.current_gentle_streak = 1
        else:
            # First practice
            self.current_gentle_streak = 1
        
        # Update longest streak
        if self.current_gentle_streak > self.longest_gentle_streak:
            self.longest_gentle_streak = self.current_gentle_streak
        
        self.last_practice_date = practice_date
        self.save()


class FlowerType(models.Model):
    """Types of flowers for different activities"""
    ACTIVITY_CHOICES = [
        ('breath', 'Respiración Consciente'),
        ('meditation', 'Meditación'),
        ('diary', 'Diario Emocional'),
        ('grounding', 'Grounding'),
        ('reflection', 'Reflexión'),
        ('calm', 'Calma'),
        ('sos', 'Recurso SOS'),
    ]
    
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_CHOICES, unique=True)
    flower_name = models.CharField(max_length=50)
    flower_emoji = models.CharField(max_length=10)
    color = models.CharField(max_length=7)  # Hex color
    description = models.TextField()
    
    class Meta:
        verbose_name = "Flower Type"
        verbose_name_plural = "Flower Types"
    
    def __str__(self):
        return f"{self.flower_emoji} {self.flower_name} ({self.activity_type})"


class Plant(models.Model):
    """Individual plant in user's garden"""
    GROWTH_STAGES = [
        ('seed', 'Semilla'),
        ('sprout', 'Brote'),
        ('growing', 'Creciendo'),
        ('blooming', 'Floreciendo'),
    ]
    
    garden = models.ForeignKey(GardenProfile, on_delete=models.CASCADE, related_name='plants')
    flower_type = models.ForeignKey(FlowerType, on_delete=models.CASCADE)
    
    # Growth tracking
    growth_stage = models.CharField(max_length=10, choices=GROWTH_STAGES, default='seed')
    times_watered = models.IntegerField(default=1)  # Number of practices
    
    # Timestamps
    planted_date = models.DateTimeField(auto_now_add=True)
    bloomed_date = models.DateTimeField(null=True, blank=True)
    
    # Position in garden (for visual layout)
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    
    class Meta:
        verbose_name = "Plant"
        verbose_name_plural = "Plants"
        ordering = ['-planted_date']
    
    def __str__(self):
        return f"{self.flower_type.flower_emoji} {self.flower_type.flower_name} - {self.growth_stage}"
    
    def water(self):
        """Water the plant (new practice activity)"""
        self.times_watered += 1
        
        # Update growth stage based on watering
        if self.times_watered >= 10 and self.growth_stage != 'blooming':
            self.growth_stage = 'blooming'
            self.bloomed_date = timezone.now()
        elif self.times_watered >= 5 and self.growth_stage == 'sprout':
            self.growth_stage = 'growing'
        elif self.times_watered >= 2 and self.growth_stage == 'seed':
            self.growth_stage = 'sprout'
        
        self.save()
    
    def get_stage_emoji(self):
        """Get emoji representation of growth stage"""
        stage_emojis = {
            'seed': '🌰',
            'sprout': '🌱',
            'growing': '🌿',
            'blooming': self.flower_type.flower_emoji,
        }
        return stage_emojis.get(self.growth_stage, '🌱')


class WellnessActivity(models.Model):
    """Track wellness activities for garden growth"""
    ACTIVITY_TYPES = [
        ('breath', 'Respiración'),
        ('meditation', 'Meditación'),
        ('diary', 'Diario'),
        ('grounding', 'Grounding'),
        ('reflection', 'Reflexión'),
        ('calm', 'Calma'),
        ('sos', 'SOS'),
    ]
    
    garden = models.ForeignKey(GardenProfile, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    
    # Duration in minutes (if applicable)
    duration_minutes = models.IntegerField(default=0)
    
    # Related plant (if this activity grew a plant)
    plant = models.ForeignKey(Plant, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Timestamp
    completed_at = models.DateTimeField(auto_now_add=True)
    
    # Notes (optional)
    notes = models.TextField(blank=True)
    
    class Meta:
        verbose_name = "Wellness Activity"
        verbose_name_plural = "Wellness Activities"
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.garden.user.username} - {self.activity_type} - {self.completed_at.strftime('%Y-%m-%d')}"


class Milestone(models.Model):
    """Gentle milestones to celebrate (no pressure achievements)"""
    MILESTONE_TYPES = [
        ('first_plant', 'Primera Planta'),
        ('first_bloom', 'Primera Flor'),
        ('7_days', '7 Días de Práctica'),
        ('15_days', '15 Días de Práctica'),
        ('30_days', '30 Días de Práctica'),
        ('10_plants', '10 Plantas'),
        ('25_plants', '25 Plantas'),
        ('50_plants', '50 Plantas'),
        ('100_plants', '100 Plantas'),
        ('all_flowers', 'Todas las Flores'),
        ('1_hour', '1 Hora de Autocuidado'),
        ('10_hours', '10 Horas de Autocuidado'),
        ('garden_month', 'Un Mes de Jardín'),
    ]
    
    garden = models.ForeignKey(GardenProfile, on_delete=models.CASCADE, related_name='milestones')
    milestone_type = models.CharField(max_length=20, choices=MILESTONE_TYPES)
    
    # Display info
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10)
    
    # When achieved
    achieved_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Milestone"
        verbose_name_plural = "Milestones"
        ordering = ['-achieved_at']
        unique_together = ['garden', 'milestone_type']
    
    def __str__(self):
        return f"{self.garden.user.username} - {self.title}"


# Default flower types data
FLOWER_TYPES_DATA = [
    {
        'activity_type': 'breath',
        'flower_name': 'Lirio',
        'flower_emoji': '🌸',
        'color': '#E9D5FF',
        'description': 'Cada respiración consciente planta un lirio de calma'
    },
    {
        'activity_type': 'meditation',
        'flower_name': 'Loto',
        'flower_emoji': '🪷',
        'color': '#FBCFE8',
        'description': 'La meditación cultiva lotos de serenidad'
    },
    {
        'activity_type': 'diary',
        'flower_name': 'Rosa',
        'flower_emoji': '🌹',
        'color': '#FECACA',
        'description': 'Escribir en tu diario hace florecer rosas de autoconocimiento'
    },
    {
        'activity_type': 'grounding',
        'flower_name': 'Girasol',
        'flower_emoji': '🌻',
        'color': '#FEF3C7',
        'description': 'Grounding arraiga girasoles de presencia'
    },
    {
        'activity_type': 'reflection',
        'flower_name': 'Tulipán',
        'flower_emoji': '🌷',
        'color': '#FBCFE8',
        'description': 'Reflexionar siembra tulipanes de claridad'
    },
    {
        'activity_type': 'calm',
        'flower_name': 'Lavanda',
        'flower_emoji': '💜',
        'color': '#C4B5FD',
        'description': 'La calma cultiva campos de lavanda'
    },
    {
        'activity_type': 'sos',
        'flower_name': 'Margarita',
        'flower_emoji': '🌼',
        'color': '#FEF3C7',
        'description': 'Buscar ayuda es plantar margaritas de valentía'
    },
]
