from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EntryViewSet,
    SOSResourceViewSet,
    UserRegistrationView,
    UserProfileView,
    mood_stats,
    RateLimitedTokenObtainPairView
)
from .garden_views import GardenViewSet

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')
router.register(r'garden', GardenViewSet, basename='garden')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', RateLimitedTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('mood-stats/', mood_stats, name='mood-stats'),
    # Alias para compatibilidad con frontend
    path('entries/stats/', mood_stats, name='entries-stats'),
]

