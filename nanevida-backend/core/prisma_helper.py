"""
Prisma Database Helper
Proporciona funciones para usar Prisma junto con Django ORM
"""

from prisma import Prisma
from typing import Optional
import asyncio

# Instancia global de Prisma
_prisma_client: Optional[Prisma] = None


async def get_prisma_client() -> Prisma:
    """
    Obtiene o crea la instancia de Prisma Client.
    Usa esta función en vistas async.
    """
    global _prisma_client
    
    if _prisma_client is None:
        _prisma_client = Prisma()
        await _prisma_client.connect()
    
    return _prisma_client


async def close_prisma_client():
    """
    Cierra la conexión de Prisma Client.
    Llama esto al finalizar la aplicación.
    """
    global _prisma_client
    
    if _prisma_client is not None:
        await _prisma_client.disconnect()
        _prisma_client = None


def get_prisma_sync() -> Prisma:
    """
    Obtiene Prisma Client de forma síncrona.
    Útil para operaciones no-async.
    """
    return asyncio.run(get_prisma_client())


# Context manager para operaciones con Prisma
class PrismaContext:
    """
    Context manager para manejar conexiones de Prisma.
    
    Uso:
        async with PrismaContext() as db:
            user = await db.user.find_first(where={"email": "user@example.com"})
    """
    
    def __init__(self):
        self.db: Optional[Prisma] = None
    
    async def __aenter__(self) -> Prisma:
        self.db = await get_prisma_client()
        return self.db
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # No cerramos la conexión aquí para reutilizarla
        pass


# Ejemplo de uso en vistas Django
"""
from django.http import JsonResponse
from asgiref.sync import async_to_sync
from core.prisma_helper import PrismaContext

async def get_entries_prisma(request):
    async with PrismaContext() as db:
        entries = await db.entry.find_many(
            where={"ownerId": request.user.id},
            order_by={"createdAt": "desc"}
        )
        return JsonResponse({"entries": [e.dict() for e in entries]}, safe=False)

# Hacer sync si es necesario
get_entries_view = async_to_sync(get_entries_prisma)
"""
