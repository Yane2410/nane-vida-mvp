# ========================================
# NANE VIDA - PostgreSQL Setup Script (Windows)
# ========================================
# Este script configura PostgreSQL para NANE VIDA

Write-Host "🚀 NANE VIDA - PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Variables de configuración
$DB_NAME = "nanevidadb"
$DB_USER = "naneuser"
$DB_PASSWORD = "nanepass123"
$DB_HOST = "localhost"
$DB_PORT = "5432"

# Verificar si PostgreSQL está instalado
Write-Host "🔍 Verificando instalación de PostgreSQL..." -ForegroundColor Yellow

$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Opciones de instalación:" -ForegroundColor Yellow
    Write-Host "  1. Descargar desde: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "  2. Usar Chocolatey: choco install postgresql" -ForegroundColor White
    Write-Host "  3. Usar Winget: winget install PostgreSQL.PostgreSQL" -ForegroundColor White
    Write-Host ""
    
    $install = Read-Host "¿Deseas abrir la página de descarga? (S/N)"
    if ($install -eq "S" -or $install -eq "s") {
        Start-Process "https://www.postgresql.org/download/windows/"
    }
    exit 1
}

Write-Host "✅ PostgreSQL encontrado en: $($pgPath.Path)" -ForegroundColor Green
Write-Host ""

# Solicitar contraseña de postgres
Write-Host "🔐 Necesitamos la contraseña del usuario 'postgres'" -ForegroundColor Yellow
Write-Host "   (Es la contraseña que configuraste al instalar PostgreSQL)" -ForegroundColor Gray
Write-Host ""

$env:PGPASSWORD = Read-Host "Contraseña de postgres" -AsSecureString
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD)
)

Write-Host ""
Write-Host "📊 Creando base de datos..." -ForegroundColor Yellow

# Ejecutar el script SQL
$sqlScript = @"
-- Eliminar conexiones existentes
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

-- Crear usuario
DO `$`$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
`$`$;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Conectar a la base de datos y configurar permisos
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
"@

# Guardar y ejecutar script
$sqlScript | Out-File -FilePath "temp_setup.sql" -Encoding UTF8
$result = psql -U postgres -f temp_setup.sql 2>&1
Remove-Item "temp_setup.sql" -ErrorAction SilentlyContinue

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Base de datos creada exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Detalles de conexión:" -ForegroundColor Cyan
    Write-Host "  Database: $DB_NAME" -ForegroundColor White
    Write-Host "  User: $DB_USER" -ForegroundColor White
    Write-Host "  Password: $DB_PASSWORD" -ForegroundColor White
    Write-Host "  Host: $DB_HOST" -ForegroundColor White
    Write-Host "  Port: $DB_PORT" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 DATABASE_URL:" -ForegroundColor Cyan
    $DATABASE_URL = "postgresql://$DB_USER`:$DB_PASSWORD@$DB_HOST`:$DB_PORT/$DB_NAME"
    Write-Host "  $DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
    
    # Actualizar archivo .env
    Write-Host "📝 Actualizando archivo .env..." -ForegroundColor Yellow
    $envPath = ".env"
    
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath
        $newContent = @()
        $dbUrlFound = $false
        
        foreach ($line in $envContent) {
            if ($line -match "^DATABASE_URL=") {
                $newContent += "DATABASE_URL=$DATABASE_URL"
                $dbUrlFound = $true
            } else {
                $newContent += $line
            }
        }
        
        if (-not $dbUrlFound) {
            $newContent += ""
            $newContent += "# Database"
            $newContent += "DATABASE_URL=$DATABASE_URL"
        }
        
        $newContent | Out-File -FilePath $envPath -Encoding UTF8
        Write-Host "✅ Archivo .env actualizado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Archivo .env no encontrado. Créalo con:" -ForegroundColor Yellow
        Write-Host "  DATABASE_URL=$DATABASE_URL" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "🎯 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Activa el entorno virtual: .\venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "  2. Ejecuta las migraciones: python manage.py migrate" -ForegroundColor White
    Write-Host "  3. Crea un superusuario: python manage.py createsuperuser" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Cambia las credenciales en producción!" -ForegroundColor Red
    
} else {
    Write-Host ""
    Write-Host "❌ Error al crear la base de datos" -ForegroundColor Red
    Write-Host "Error: $result" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "  1. Verifica que el servicio PostgreSQL esté corriendo" -ForegroundColor White
    Write-Host "  2. Verifica la contraseña de 'postgres'" -ForegroundColor White
    Write-Host "  3. Verifica que el puerto 5432 esté disponible" -ForegroundColor White
}

# Limpiar variable de entorno
$env:PGPASSWORD = $null

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
