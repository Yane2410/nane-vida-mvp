# 🗄️ Guía Completa de Base de Datos PostgreSQL

## 📋 Contenido
1. [Opción 1: PostgreSQL Local](#opción-1-postgresql-local)
2. [Opción 2: PostgreSQL en Docker](#opción-2-postgresql-en-docker)
3. [Opción 3: PostgreSQL en la Nube (GRATIS)](#opción-3-postgresql-en-la-nube)
4. [Opción 4: Usar SQLite (Desarrollo)](#opción-4-usar-sqlite-desarrollo)

---

## Opción 1: PostgreSQL Local

### 🪟 Windows

#### A. Instalación

**Método 1: Instalador Oficial**
1. Descarga desde: https://www.postgresql.org/download/windows/
2. Ejecuta el instalador (PostgreSQL 14+)
3. Durante la instalación:
   - Puerto: 5432 (default)
   - Contraseña de postgres: **¡ANÓTALA!**
   - Instala Stack Builder (opcional)

**Método 2: Chocolatey**
```powershell
choco install postgresql
```

**Método 3: Winget**
```powershell
winget install PostgreSQL.PostgreSQL
```

#### B. Crear Base de Datos

**Usando nuestro script automatizado:**
```powershell
cd nanevida-backend
.\setup_postgres.ps1
```

**Manualmente:**
```powershell
# 1. Abrir SQL Shell (psql)
# 2. Conectar como postgres
# 3. Ejecutar:
CREATE DATABASE nanevidadb;
CREATE USER naneuser WITH PASSWORD 'nanepass123';
GRANT ALL PRIVILEGES ON DATABASE nanevidadb TO naneuser;
```

### 🐧 Linux (Ubuntu/Debian)

#### A. Instalación
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### B. Crear Base de Datos

**Usando nuestro script:**
```bash
cd nanevida-backend
chmod +x setup_postgres.sh
./setup_postgres.sh
```

**Manualmente:**
```bash
sudo -u postgres psql
CREATE DATABASE nanevidadb;
CREATE USER naneuser WITH PASSWORD 'nanepass123';
GRANT ALL PRIVILEGES ON DATABASE nanevidadb TO naneuser;
\q
```

### 🍎 macOS

#### A. Instalación
```bash
# Usando Homebrew
brew install postgresql@14
brew services start postgresql@14
```

#### B. Crear Base de Datos

**Usando nuestro script:**
```bash
cd nanevida-backend
chmod +x setup_postgres.sh
./setup_postgres.sh
```

---

## Opción 2: PostgreSQL en Docker

### ✅ Ventajas
- No requiere instalación en tu sistema
- Fácil de limpiar y reiniciar
- Ideal para desarrollo
- Aislado del resto del sistema

### 📦 Instalación

**1. Instalar Docker Desktop**
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt install docker.io`

**2. Crear y ejecutar PostgreSQL**

```bash
# Ejecutar PostgreSQL en Docker
docker run --name nane-postgres \
  -e POSTGRES_USER=naneuser \
  -e POSTGRES_PASSWORD=nanepass123 \
  -e POSTGRES_DB=nanevidadb \
  -p 5432:5432 \
  -d postgres:14

# Verificar que está corriendo
docker ps

# Ver logs
docker logs nane-postgres
```

**3. Comandos útiles**

```bash
# Detener
docker stop nane-postgres

# Iniciar
docker start nane-postgres

# Eliminar (¡cuidado! borra todos los datos)
docker rm -f nane-postgres

# Conectar con psql
docker exec -it nane-postgres psql -U naneuser -d nanevidadb
```

**4. Docker Compose (Recomendado)**

Crea `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: nane-postgres
    environment:
      POSTGRES_USER: naneuser
      POSTGRES_PASSWORD: nanepass123
      POSTGRES_DB: nanevidadb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U naneuser"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Comandos:
```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Eliminar todo (incluyendo datos)
docker-compose down -v
```

**DATABASE_URL:**
```env
DATABASE_URL=postgresql://naneuser:nanepass123@localhost:5432/nanevidadb
```

---

## Opción 3: PostgreSQL en la Nube (GRATIS)

### 🌐 A. Neon (Recomendado) ⭐

**✅ Ventajas:**
- Totalmente gratis (hasta 10GB)
- Serverless
- Auto-scaling
- Sin tarjeta de crédito
- Branching de base de datos

**📝 Pasos:**

1. Visita: https://neon.tech
2. Regístrate con GitHub
3. Crea un nuevo proyecto: "NANE VIDA"
4. Selecciona región más cercana
5. Copia el DATABASE_URL

**Ejemplo:**
```env
DATABASE_URL=postgresql://naneuser:password@ep-xxx.us-east-2.aws.neon.tech/nanevidadb?sslmode=require
```

### 🌐 B. Supabase

**✅ Ventajas:**
- Gratis hasta 500MB
- Incluye autenticación y storage
- Interfaz web

**📝 Pasos:**

1. Visita: https://supabase.com
2. Crea cuenta
3. New Project
4. Obtén DATABASE_URL desde Settings > Database

### 🌐 C. Railway

**✅ Ventajas:**
- $5 gratis mensual
- Deploy automático
- PostgreSQL incluido

**📝 Pasos:**

1. Visita: https://railway.app
2. New Project > Deploy PostgreSQL
3. Variables > DATABASE_URL

### 🌐 D. ElephantSQL

**✅ Ventajas:**
- 20MB gratis
- Fácil de usar
- Sin tarjeta de crédito

**📝 Pasos:**

1. Visita: https://www.elephantsql.com
2. Sign up
3. Create New Instance > Tiny Turtle (free)
4. Copia la URL

### 🌐 E. Render

**✅ Ventajas:**
- Gratis con limitaciones
- Fácil integración

**📝 Pasos:**

1. Visita: https://render.com
2. New > PostgreSQL
3. Free tier
4. Obtén URL de conexión

---

## Opción 4: Usar SQLite (Desarrollo)

### ✅ La más simple

**No requiere instalación de nada adicional!**

**En tu `.env`:**
```env
# Dejar DATABASE_URL vacío o comentado
# DATABASE_URL=

# O explícitamente usar SQLite:
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

Django usará automáticamente SQLite.

**✅ Ventajas:**
- Cero configuración
- Archivo único
- Perfecto para desarrollo y pruebas

**❌ Desventajas:**
- No recomendado para producción
- Sin concurrent writes
- Características limitadas

---

## 🔧 Configuración en Django

### 1. Actualizar .env

Elige UNA de estas opciones:

**Opción A: DATABASE_URL (Recomendado)**
```env
DATABASE_URL=postgresql://naneuser:nanepass123@localhost:5432/nanevidadb
```

**Opción B: Variables individuales**
```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=nanevidadb
DB_USER=naneuser
DB_PASSWORD=nanepass123
DB_HOST=localhost
DB_PORT=5432
```

**Opción C: SQLite (desarrollo)**
```env
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
```

### 2. Ejecutar Migraciones

```bash
# Activar entorno virtual
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### 3. Verificar Conexión

```bash
python manage.py dbshell
```

Si conecta correctamente, ¡todo funciona! ✅

---

## 🐛 Troubleshooting

### Error: "could not connect to server"

**Windows:**
```powershell
# Verificar servicio
Get-Service -Name postgresql*

# Iniciar servicio
Start-Service postgresql-x64-14
```

**Linux:**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Docker:**
```bash
docker ps
docker start nane-postgres
```

### Error: "FATAL: password authentication failed"

1. Verifica usuario y contraseña en .env
2. Recrea el usuario:
```sql
DROP USER IF EXISTS naneuser;
CREATE USER naneuser WITH PASSWORD 'nueva-password';
GRANT ALL PRIVILEGES ON DATABASE nanevidadb TO naneuser;
```

### Error: "database does not exist"

```sql
CREATE DATABASE nanevidadb;
```

### Puerto 5432 en uso

```bash
# Ver qué está usando el puerto
# Windows:
netstat -ano | findstr :5432

# Linux/Mac:
lsof -i :5432

# Cambiar puerto en PostgreSQL o usar otro puerto:
DATABASE_URL=postgresql://naneuser:pass@localhost:5433/nanevidadb
```

---

## 🎯 Recomendaciones

### Para Desarrollo Local:
1. **Primera opción**: Docker (limpio y aislado)
2. **Segunda opción**: PostgreSQL local
3. **Tercera opción**: SQLite (más simple)

### Para Producción:
1. **Primera opción**: Neon (gratis, sin configuración)
2. **Segunda opción**: Railway (fácil deploy)
3. **Tercera opción**: Render (incluye backend hosting)

---

## 📊 Comparación Rápida

| Opción | Dificultad | Costo | Mejor Para |
|--------|-----------|-------|------------|
| PostgreSQL Local | Media | Gratis | Desarrollo serio |
| Docker | Baja | Gratis | Desarrollo rápido |
| Neon | Muy Baja | Gratis | Producción |
| SQLite | Muy Baja | Gratis | Pruebas rápidas |
| Railway | Baja | $5 gratis | Full deployment |

---

## ✅ Próximos Pasos

Después de configurar la base de datos:

1. ✅ Ejecutar migraciones: `python manage.py migrate`
2. ✅ Crear superusuario: `python manage.py createsuperuser`
3. ✅ Iniciar servidor: `python manage.py runserver`
4. ✅ Acceder al admin: http://localhost:8000/admin

---

**¿Necesitas ayuda?** Elige la opción que prefieras y te guiaré paso a paso! 🚀
