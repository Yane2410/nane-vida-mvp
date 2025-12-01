from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, SOSResourceViewSet, init_user

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')

urlpatterns = [
    path('', include(router.urls)),
    path('init-user/', init_user),  # Ruta temporal para crear primer usuario
]
