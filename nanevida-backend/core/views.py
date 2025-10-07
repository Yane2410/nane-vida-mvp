from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Entry, SOSResource
from .serializers import EntrySerializer, SOSResourceSerializer
from .permissions import IsOwner

class EntryViewSet(viewsets.ModelViewSet):
    serializer_class = EntrySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Entry.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SOSResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SOSResource.objects.filter(active=True).order_by('priority')
    serializer_class = SOSResourceSerializer
    permission_classes = [permissions.AllowAny]
