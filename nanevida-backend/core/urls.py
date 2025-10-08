from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, SOSResourceViewSet

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, SOSResourceViewSet, init_user  # 👈 importa init_user

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')

urlpatterns = [
    path('', include(router.urls)),
    path('init-user/', init_user),  # 👈 RUTA TEMPORAL
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EntryViewSet, SOSResourceViewSet, bootstrap_admin  # 👈 importa esto

router = DefaultRouter()
router.register(r'entries', EntryViewSet, basename='entry')
router.register(r'sos', SOSResourceViewSet, basename='sos')

urlpatterns = [
    path('', include(router.urls)),
    path('bootstrap-admin/', bootstrap_admin),   # 👈 RUTA TEMPORAL
]
