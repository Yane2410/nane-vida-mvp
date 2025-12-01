# 🚀 NANE VIDA - Guía de Deployment

## 📋 Contenido
- [Deployment en Vercel (Frontend)](#deployment-en-vercel-frontend)
- [Deployment Backend (Railway/Render/Heroku)](#deployment-backend)
- [Configuración de Prisma](#configuración-de-prisma)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)

---

## 🎨 Deployment en Vercel (Frontend)

### 1. Preparación

El frontend ya está configurado para Vercel con:
- ✅ `vercel.json` con headers de seguridad
- ✅ Build optimizado con Vite
- ✅ Variables de entorno configurables

### 2. Deployment en Vercel

#### Opción A: Desde el Dashboard de Vercel

1. Visita [vercel.com](https://vercel.com) y crea una cuenta
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `nanevida-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Configura las variables de entorno:
   ```
   VITE_API_BASE=https://tu-backend.onrender.com/api
   VITE_ENV=production
   ```

6. Click en "Deploy"

#### Opción B: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Navegar al frontend
cd nanevida-frontend

# Login en Vercel
vercel login

# Deployment
vercel

# Deployment a producción
vercel --prod
```

### 3. Configurar Dominio Personalizado (Opcional)

1. En el dashboard de Vercel, ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

---

## 🔧 Deployment Backend

### Opción 1: Railway

#### 1. Preparación
```bash
cd nanevida-backend
```

#### 2. Crear cuenta en Railway
- Visita [railway.app](https://railway.app)
- Conecta tu cuenta de GitHub

#### 3. Nuevo Proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio
4. Railway detectará automáticamente Python/Django

#### 4. Configurar Variables de Entorno

En Railway Dashboard > Variables:

```env
# Django Core
SECRET_KEY=tu-secret-key-super-segura-generada
DJANGO_ENV=production
DEBUG=False
ALLOWED_HOSTS=tu-app.railway.app

# Database (Railway proporciona PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# CORS
FRONTEND_ORIGIN=https://tu-frontend.vercel.app
BACKEND_ORIGIN=https://tu-app.railway.app

# JWT
JWT_ACCESS_LIFETIME_MINUTES=15
JWT_REFRESH_LIFETIME_DAYS=7
```

#### 5. Agregar PostgreSQL
1. En tu proyecto, click en "New"
2. Selecciona "Database" > "Add PostgreSQL"
3. Railway automáticamente configurará DATABASE_URL

#### 6. Deployment
Railway deployará automáticamente cuando hagas push a tu repositorio.

#### 7. Migraciones
En Railway, abre la terminal y ejecuta:
```bash
python manage.py migrate
python manage.py createsuperuser
```

---

### Opción 2: Render

#### 1. Crear cuenta en Render
- Visita [render.com](https://render.com)

#### 2. Nuevo Web Service
1. Click en "New +" > "Web Service"
2. Conecta tu repositorio
3. Configura:
   - **Name**: nane-vida-backend
   - **Region**: Elige la más cercana
   - **Branch**: main
   - **Root Directory**: nanevida-backend
   - **Runtime**: Python 3
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput
     ```
   - **Start Command**: 
     ```bash
     gunicorn nane.wsgi:application
     ```

#### 3. Variables de Entorno (igual que Railway)

#### 4. Agregar PostgreSQL
1. Click en "New +" > "PostgreSQL"
2. Copia la URL externa
3. Agrégala como DATABASE_URL en tu Web Service

---

## 🗄️ Configuración de Prisma

### 1. ¿Por qué Prisma?

Prisma proporciona:
- ✅ Type-safe database access
- ✅ Auto-completion
- ✅ Migrations automáticas
- ✅ Compatible con PostgreSQL, MySQL, SQLite

### 2. Configuración Local

```bash
cd nanevida-backend
source venv/bin/activate  # Windows: .\venv\Scripts\Activate.ps1

# Generar Prisma Client
prisma generate

# Sincronizar schema con DB existente (opcional)
prisma db pull

# Crear migración desde schema
prisma migrate dev --name init
```

### 3. Usar Prisma en Django

Ejemplo en `views.py`:

```python
from core.prisma_helper import PrismaContext
from asgiref.sync import async_to_sync

async def get_my_entries(request):
    async with PrismaContext() as db:
        entries = await db.entry.find_many(
            where={"ownerId": request.user.id},
            order_by={"createdAt": "desc"},
            take=10
        )
        return JsonResponse({"entries": [e.dict() for e in entries]})

# Convertir a sync
get_my_entries_view = async_to_sync(get_my_entries)
```

### 4. Prisma vs Django ORM

**Usa Django ORM cuando:**
- Necesitas autenticación de Django
- Usas el admin de Django
- Prefieres la sintaxis de Django

**Usa Prisma cuando:**
- Necesitas mejor type-safety
- Quieres queries más complejas
- Trabajas con TypeScript en frontend

**Puedes usar ambos en el mismo proyecto!**

---

## 🔐 Variables de Entorno

### Frontend (.env)

```env
# API
VITE_API_BASE=http://127.0.0.1:8000/api

# Environment
VITE_ENV=development
VITE_DEBUG=true

# Security
VITE_ENABLE_SECURITY_HEADERS=true
VITE_CSP_ENABLED=true
```

### Backend (.env)

```env
# Django Core
SECRET_KEY=tu-secret-key-aqui
DJANGO_ENV=development
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nanevidadb
# O individual:
DB_ENGINE=django.db.backends.postgresql
DB_NAME=nanevidadb
DB_USER=postgres
DB_PASSWORD=tu-password
DB_HOST=localhost
DB_PORT=5432

# CORS
FRONTEND_ORIGIN=http://localhost:5173
BACKEND_ORIGIN=http://localhost:8000

# JWT
JWT_ACCESS_LIFETIME_MINUTES=15
JWT_REFRESH_LIFETIME_DAYS=7
```

---

## 💾 Base de Datos

### PostgreSQL Local (Desarrollo)

#### 1. Instalar PostgreSQL
- **Windows**: [PostgreSQL.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql`

#### 2. Crear Base de Datos

```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear database
CREATE DATABASE nanevidadb;

# Crear usuario
CREATE USER naneuser WITH PASSWORD 'tu-password';

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE nanevidadb TO naneuser;

# Salir
\q
```

#### 3. Configurar .env

```env
DATABASE_URL=postgresql://naneuser:tu-password@localhost:5432/nanevidadb
```

#### 4. Migrar

```bash
cd nanevida-backend
source venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
```

### PostgreSQL en Producción

Ambos Railway y Render proporcionan PostgreSQL managed:

- **Railway**: Agrega PostgreSQL desde el dashboard
- **Render**: Crea PostgreSQL Database separado

Ambos te darán una DATABASE_URL que debes configurar en las variables de entorno.

---

## 🚦 Testing

### Backend

```bash
cd nanevida-backend
source venv/bin/activate
python manage.py test
```

### Frontend

```bash
cd nanevida-frontend
npm run build
npm run preview
```

---

## 📊 Monitoring

### Backend Health Check

Crea un endpoint de health:

```python
# En core/views.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "healthy",
        "environment": settings.DJANGO_ENV
    })

# En core/urls.py
urlpatterns = [
    path('health/', health_check),
    # ... otras rutas
]
```

### Frontend

Vercel proporciona analytics automáticos en el dashboard.

---

## 🔄 CI/CD

### GitHub Actions (Opcional)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd nanevida-frontend && npm install && npm run build
      
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: cd nanevida-backend && pip install -r requirements.txt
      - run: python manage.py test
```

---

## 🆘 Troubleshooting

### Error: CORS

Asegúrate de que FRONTEND_ORIGIN esté configurado correctamente en el backend.

### Error: Database Connection

Verifica que DATABASE_URL esté correctamente configurado y que la base de datos esté accesible.

### Error: Static Files

En producción, ejecuta:
```bash
python manage.py collectstatic --noinput
```

### Error: Prisma

Si tienes problemas con Prisma:
```bash
prisma generate --schema=./prisma/schema.prisma
```

---

## 📞 Soporte

- **Documentación Django**: [docs.djangoproject.com](https://docs.djangoproject.com)
- **Documentación Prisma**: [prisma.io/docs](https://www.prisma.io/docs)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)

---

¡Listo para deployment! 🎉
