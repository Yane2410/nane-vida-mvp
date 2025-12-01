# 🌸 NANE VIDA – MVP

**Plataforma de bienestar emocional con diario personal y recursos SOS**

[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blueviolet.svg)](https://www.prisma.io/)
[![Security](https://img.shields.io/badge/Security-Enhanced-success.svg)](./SECURITY.md)

---

## ✨ Características

- 📝 **Diario Personal** - Crea y gestiona entradas privadas con emojis
- 🆘 **Recursos SOS** - Acceso rápido a recursos de ayuda
- 🔐 **Seguridad Robusta** - JWT, rate limiting, CSP, y más
- 🚀 **Production Ready** - Compatible con Vercel, Railway, Render
- 🗄️ **Flexible DB** - Soporta PostgreSQL, SQLite, Prisma ORM
- 🎨 **Modern Stack** - React + TypeScript + Vite

---

## 🚀 Inicio Rápido

### 1️⃣ Clonar Repositorio
```bash
git clone https://github.com/Yane2410/nane-vida-mvp.git
cd nane-vida-mvp
```

### 2️⃣ Backend Setup
```bash
cd nanevida-backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
.\venv\Scripts\Activate.ps1
# O en Linux/Mac: source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

Backend disponible en: **http://127.0.0.1:8000**

### 3️⃣ Frontend Setup
```bash
cd nanevida-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tu URL del backend

# Iniciar servidor
npm run dev
```

Frontend disponible en: **http://localhost:5173**

---

## 🗄️ Configurar Base de Datos

Tienes varias opciones:

### Opción 1: SQLite (Más Simple) ✅
**No requiere configuración adicional!**

En `.env`:
```env
# Dejar DATABASE_URL vacío
```

Django usará SQLite automáticamente. Perfecto para desarrollo.

### Opción 2: PostgreSQL Local

**Windows:**
```powershell
cd nanevida-backend
.\setup_postgres.ps1
```

**Linux/Mac:**
```bash
cd nanevida-backend
chmod +x setup_postgres.sh
./setup_postgres.sh
```

### Opción 3: PostgreSQL en Docker
```bash
docker run --name nane-postgres \
  -e POSTGRES_USER=naneuser \
  -e POSTGRES_PASSWORD=nanepass123 \
  -e POSTGRES_DB=nanevidadb \
  -p 5432:5432 \
  -d postgres:14
```

### Opción 4: PostgreSQL en la Nube (GRATIS)

**Recomendado: Neon** 🌟
1. Visita https://neon.tech
2. Crea proyecto gratis
3. Copia el DATABASE_URL
4. Pégalo en tu `.env`

**Ver todas las opciones:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

---

## 📚 Documentación

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía completa de deployment
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Configuración de bases de datos
- **[SECURITY.md](./SECURITY.md)** - Características de seguridad

---

## 🛠️ Stack Tecnológico

### Backend
- Django 4.2.16
- Django REST Framework
- JWT Authentication (SimpleJWT)
- PostgreSQL / SQLite
- Prisma ORM (opcional)
- Gunicorn

### Frontend
- React 18
- TypeScript 5.7
- Vite 7
- Axios
- React Router 6

### Seguridad
- Argon2 password hashing
- CORS headers
- Content Security Policy
- Rate limiting
- Input sanitization

---

## 📦 Estructura del Proyecto

```
nane-vida-mvp/
├── nanevida-backend/          # Django REST API
│   ├── core/                  # App principal
│   ├── nane/                  # Configuración
│   ├── prisma/                # Prisma schema
│   ├── requirements.txt       # Dependencias Python
│   ├── .env.example          # Variables de entorno
│   ├── setup_postgres.ps1    # Script setup Windows
│   └── setup_postgres.sh     # Script setup Linux/Mac
│
├── nanevida-frontend/         # React + TypeScript
│   ├── src/
│   │   ├── api.ts            # Cliente API mejorado
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas
│   │   └── main.tsx          # Entry point
│   ├── package.json          # Dependencias Node
│   ├── vite.config.ts        # Configuración Vite
│   ├── vercel.json           # Config Vercel
│   └── .env.example          # Variables de entorno
│
├── DEPLOYMENT.md             # Guía de deployment
├── DATABASE_SETUP.md         # Guía de base de datos
└── README.md                 # Este archivo
```

---

## 🌐 Deploy a Producción

### Frontend (Vercel)
```bash
cd nanevida-frontend
npm install -g vercel
vercel --prod
```

### Backend (Railway)
1. Conecta tu repo en [railway.app](https://railway.app)
2. Agrega PostgreSQL
3. Configura variables de entorno
4. Deploy automático ✅

**Guía completa:** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🔐 Seguridad

Este proyecto implementa **Security by Default** y **Security by Design**:

✅ JWT con refresh tokens  
✅ Rate limiting (20/min anónimo, 100/min autenticado)  
✅ CORS configurado correctamente  
✅ Content Security Policy  
✅ Headers de seguridad HTTP  
✅ Argon2 password hashing  
✅ Input sanitization  
✅ CSRF protection  
✅ XSS prevention  

---

## 📖 API Endpoints

### Autenticación
```http
POST /api/token/
POST /api/token/refresh/
```

### Entradas de Diario (Autenticado)
```http
GET    /api/entries/
POST   /api/entries/
GET    /api/entries/{id}/
PUT    /api/entries/{id}/
DELETE /api/entries/{id}/
```

### Recursos SOS (Público)
```http
GET /api/sos/
```

---

## 🧪 Testing

### Backend
```bash
cd nanevida-backend
python manage.py test
```

### Frontend
```bash
cd nanevida-frontend
npm run build
npm run preview
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Variables de Entorno

### Backend (.env)
```env
SECRET_KEY=tu-secret-key-segura
DJANGO_ENV=development
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DATABASE_URL=postgresql://user:pass@localhost:5432/db
# O para SQLite: (dejar vacío)

FRONTEND_ORIGIN=http://localhost:5173
JWT_ACCESS_LIFETIME_MINUTES=15
JWT_REFRESH_LIFETIME_DAYS=7
```

### Frontend (.env)
```env
VITE_API_BASE=http://127.0.0.1:8000/api
VITE_ENV=development
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
Ver [DATABASE_SETUP.md](./DATABASE_SETUP.md) - sección Troubleshooting

### Error: "CORS error"
Verifica que `FRONTEND_ORIGIN` en `.env` del backend coincida con la URL del frontend

### Error: "Module not found"
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

---

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Yane2410/nane-vida-mvp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Yane2410/nane-vida-mvp/discussions)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🌟 Características Próximas

- [ ] Tests automatizados completos
- [ ] CI/CD con GitHub Actions
- [ ] Notificaciones push
- [ ] Modo offline con PWA
- [ ] Exportar entradas (PDF, JSON)
- [ ] Tema oscuro
- [ ] Soporte multiidioma

---

**Hecho con ❤️ para el bienestar emocional**

🚀 **¡Listo para empezar!** Sigue los pasos de [Inicio Rápido](#-inicio-rápido)
