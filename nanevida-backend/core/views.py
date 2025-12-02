from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Count
from datetime import datetime, timedelta
from .models import Entry, SOSResource, UserProfile
from .serializers import (
    EntrySerializer,
    SOSResourceSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer
)
from .permissions import IsOwner


# Custom throttle for login
class LoginRateThrottle(AnonRateThrottle):
    """Rate limit para login: 5 intentos por minuto"""
    rate = '5/min'


# Custom throttle for entry creation
class EntryCreationThrottle(UserRateThrottle):
    """Rate limit para creación de entradas: 10 por minuto"""
    rate = '10/min'


class RateLimitedTokenObtainPairView(TokenObtainPairView):
    """Vista de login con rate limiting: 5 intentos por minuto"""
    throttle_classes = [LoginRateThrottle]


class EntryViewSet(viewsets.ModelViewSet):
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
    """Vista para ver y actualizar el perfil del usuario"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mood_stats(request):
    """Estadísticas de ánimo de los últimos 30 días"""
    days = int(request.query_params.get('days', 30))
    start_date = datetime.now() - timedelta(days=days)
    
    entries = Entry.objects.filter(
        owner=request.user,
        created_at__gte=start_date,
        mood__isnull=False
    ).exclude(mood='').order_by('created_at')
    
    # Contar por mood
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


# --- INIT USER (TEMPORAL) ---
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import get_user_model

@csrf_exempt
def init_user(request):
    """
    Endpoint TEMPORAL para crear el primer usuario en producción
    cuando no hay Shell/Pre-Deploy.
    Solo funciona si NO existen usuarios aún.
    Uso (GET o POST):
      /api/init-user/?u=Yane&e=tu@correo.com&p=UnaClaveFuerte123&super=1
    Luego de crear el usuario, BORRAR este endpoint y su ruta.
    """
    if request.method not in ("GET", "POST"):
        return JsonResponse({"detail": "method not allowed"}, status=405)

    User = get_user_model()
    if User.objects.exists():
        return JsonResponse({"detail": "disabled: users already exist"}, status=403)

    u = (request.GET.get("u") or request.POST.get("u") or "").strip()
    e = (request.GET.get("e") or request.POST.get("e") or "").strip()
    p = (request.GET.get("p") or request.POST.get("p") or "").strip()
    make_super = (request.GET.get("super") or request.POST.get("super") or "").lower() in ("1","true","yes")

    if not (u and e and p):
        return JsonResponse({"detail": "missing fields: u (username), e (email), p (password)"}, status=400)

    if make_super:
        User.objects.create_superuser(u, e, p)
    else:
        User.objects.create_user(u, e, p)

    return JsonResponse({"created": True, "username": u, "superuser": make_super})

