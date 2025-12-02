from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EntryViewSet,
    SOSResourceViewSet,
    init_user,
    UserRegistrationView,
    UserProfileView,
    mood_stats
)

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('mood-stats/', mood_stats, name='mood-stats'),
    path('init-user/', init_user),  # Ruta temporal para crear primer usuario
]
