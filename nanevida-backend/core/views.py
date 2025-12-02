from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime, timedelta
from .models import Entry, SOSResource, UserProfile
from .serializers import (
    EntrySerializer,
    SOSResourceSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer
)
from .permissions import IsOwner


class LoginRateThrottle(AnonRateThrottle):
    """Rate limiting para login: 5 intentos por minuto"""
    rate = '5/min'


class EntryCreationThrottle(UserRateThrottle):
    """Rate limiting para creación de entradas: 10 por minuto"""
    rate = '10/min'


class RateLimitedTokenObtainPairView(TokenObtainPairView):
    """Vista de login con rate limiting"""
    throttle_classes = [LoginRateThrottle]


class EntryViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de entradas del diario"""
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    throttle_classes = [EntryCreationThrottle]

    def get_queryset(self):
        return Entry.objects.filter(
            owner=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SOSResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para recursos de ayuda SOS (solo lectura)"""
    queryset = SOSResource.objects.filter(active=True).order_by('priority')
    serializer_class = SOSResourceSerializer
    permission_classes = [permissions.AllowAny]


class UserRegistrationView(generics.CreateAPIView):
    """Vista para registro de nuevos usuarios"""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Crear perfil automáticamente
        UserProfile.objects.get_or_create(user=user)

        return Response({
            "message": "Usuario registrado exitosamente",
            "username": user.username,
            "email": user.email
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vista para ver y actualizar perfil de usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mood_stats(request):
    """Estadísticas de ánimo de los últimos N días"""
    days = int(request.query_params.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)

    entries = Entry.objects.filter(
        owner=request.user,
        created_at__gte=start_date,
        mood__isnull=False
    ).exclude(mood='').order_by('created_at')

    # Contar por mood y crear timeline
    mood_counts = {}
    mood_timeline = []

    for entry in entries:
        # Contador
        if entry.mood not in mood_counts:
            mood_counts[entry.mood] = 0
        mood_counts[entry.mood] += 1

        # Timeline
        mood_timeline.append({
            'date': entry.created_at.strftime('%Y-%m-%d'),
            'mood': entry.mood,
            'title': entry.title
        })

    return Response({
        'mood_counts': mood_counts,
        'mood_timeline': mood_timeline,
        'total_entries': len(mood_timeline),
        'days': days
    })
