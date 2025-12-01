#!/bin/bash

# ========================================
# NANE VIDA - PostgreSQL Setup Script (Linux/Mac)
# ========================================
# Este script configura PostgreSQL para NANE VIDA

echo "🚀 NANE VIDA - PostgreSQL Setup"
echo "================================"
echo ""

# Variables de configuración
DB_NAME="nanevidadb"
DB_USER="naneuser"
DB_PASSWORD="nanepass123"
DB_HOST="localhost"
DB_PORT="5432"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Verificar si PostgreSQL está instalado
echo -e "${YELLOW}🔍 Verificando instalación de PostgreSQL...${NC}"

if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL no está instalado${NC}"
    echo ""
    echo -e "${YELLOW}📥 Opciones de instalación:${NC}"
    echo -e "${WHITE}  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib${NC}"
    echo -e "${WHITE}  macOS: brew install postgresql${NC}"
    echo -e "${WHITE}  CentOS/RHEL: sudo yum install postgresql-server${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL encontrado${NC}"
echo ""

# Detectar sistema operativo y configurar usuario de PostgreSQL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    POSTGRES_USER=$(whoami)
else
    # Linux
    POSTGRES_USER="postgres"
fi

echo -e "${YELLOW}📊 Creando base de datos...${NC}"
echo ""

# Crear script SQL temporal
SQL_SCRIPT=$(cat <<EOF
-- Terminar conexiones existentes
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();

-- Crear base de datos
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME
    WITH 
    ENCODING = 'UTF8'
    TEMPLATE = template0;

-- Crear usuario si no existe
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    ELSE
        ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Conectar a la base de datos
\\c $DB_NAME

-- Configurar permisos en el schema
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
EOF
)

# Ejecutar script SQL
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - generalmente no requiere sudo
    echo "$SQL_SCRIPT" | psql -U $POSTGRES_USER postgres
else
    # Linux - requiere sudo para usuario postgres
    echo "$SQL_SCRIPT" | sudo -u postgres psql
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ¡Base de datos creada exitosamente!${NC}"
    echo ""
    echo -e "${CYAN}📋 Detalles de conexión:${NC}"
    echo -e "${WHITE}  Database: $DB_NAME${NC}"
    echo -e "${WHITE}  User: $DB_USER${NC}"
    echo -e "${WHITE}  Password: $DB_PASSWORD${NC}"
    echo -e "${WHITE}  Host: $DB_HOST${NC}"
    echo -e "${WHITE}  Port: $DB_PORT${NC}"
    echo ""
    echo -e "${CYAN}🔗 DATABASE_URL:${NC}"
    DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    echo -e "${YELLOW}  $DATABASE_URL${NC}"
    echo ""
    
    # Actualizar archivo .env
    echo -e "${YELLOW}📝 Actualizando archivo .env...${NC}"
    ENV_FILE=".env"
    
    if [ -f "$ENV_FILE" ]; then
        # Verificar si DATABASE_URL ya existe
        if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
            # Reemplazar línea existente
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE"
            else
                sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" "$ENV_FILE"
            fi
        else
            # Agregar al final
            echo "" >> "$ENV_FILE"
            echo "# Database" >> "$ENV_FILE"
            echo "DATABASE_URL=$DATABASE_URL" >> "$ENV_FILE"
        fi
        echo -e "${GREEN}✅ Archivo .env actualizado${NC}"
    else
        echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Créalo con:${NC}"
        echo -e "${WHITE}  DATABASE_URL=$DATABASE_URL${NC}"
    fi
    
    echo ""
    echo -e "${CYAN}🎯 Próximos pasos:${NC}"
    echo -e "${WHITE}  1. Activa el entorno virtual: source venv/bin/activate${NC}"
    echo -e "${WHITE}  2. Ejecuta las migraciones: python manage.py migrate${NC}"
    echo -e "${WHITE}  3. Crea un superusuario: python manage.py createsuperuser${NC}"
    echo ""
    echo -e "${RED}⚠️  IMPORTANTE: Cambia las credenciales en producción!${NC}"
    
else
    echo ""
    echo -e "${RED}❌ Error al crear la base de datos${NC}"
    echo ""
    echo -e "${YELLOW}💡 Posibles soluciones:${NC}"
    echo -e "${WHITE}  1. Verifica que el servicio PostgreSQL esté corriendo${NC}"
    echo -e "${WHITE}     sudo service postgresql start (Linux)${NC}"
    echo -e "${WHITE}     brew services start postgresql (macOS)${NC}"
    echo -e "${WHITE}  2. Verifica los permisos del usuario PostgreSQL${NC}"
    echo -e "${WHITE}  3. Verifica que el puerto 5432 esté disponible${NC}"
    exit 1
fi

echo ""
