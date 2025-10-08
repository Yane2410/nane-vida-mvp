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

