# 🌸 NANE VIDA - Plataforma de Bienestar Emocional

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django" alt="Django" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</div>

<div align="center">
  <h3>Tu espacio seguro de autocuidado y bienestar mental</h3>
  <p>Una plataforma empática para el cuidado emocional con herramientas terapéuticas interactivas</p>
</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Stack Tecnológico](#-stack-tecnológico)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Seguridad](#-seguridad)
- [Documentación](#-documentación)
- [Contribuir](#-contribuir)
- [Contacto](#-contacto)

---

## ✨ Características

### 🏠 Página Principal
- **MoodSelector**: Selector de estados emocionales con 6 opciones
- **EmotionalCards**: Accesos rápidos a herramientas de bienestar
- **AppHeader**: Saludos contextuales según hora del día
- **Diseño pastel**: Colores suaves y empáticos

### 📔 Diario Emocional
- Crea, edita y elimina entradas personales
- Registro de emociones con fecha y hora
- Estadísticas de uso (entradas totales, semana, mes, racha)
- Filtrado por rango de fechas
- Gráficas de humor

### 🧘 Herramientas de Bienestar

#### 1. ☁️ Calma Rápida (`/calm`)
- 4 técnicas de regulación emocional de 5 minutos
- Sistema de pasos guiados con navegación
- Técnicas: Respiración 4-7-8, Relajación Muscular, Visualización, Técnica de la Mano

#### 2. 🫁 Respiración Guiada (`/breath`)
- Animación de círculo que se expande y contrae en tiempo real
- 2 patrones: 4-4-4 Cuadrada y 4-7-8 Relajante
- Timer con ciclos automáticos
- Contador de repeticiones

#### 3. 🌸 Reflexión Guiada (`/reflection`)
- 8 preguntas introspectivas categorizadas
- Función "Pregunta al azar"
- Guardado persistente en localStorage
- Vista de historial con timestamps

#### 4. 🌿 Técnicas de Grounding (`/grounding`)
- Técnica 5-4-3-2-1 interactiva
- Checklist dinámico con validación
- Barra de progreso visual
- Pantalla de completado con resumen

### 🆘 Recursos de Apoyo
- Líneas de ayuda profesional 24/7
- Recursos categorizados (llamada, enlace, texto)
- Aviso de emergencia visible

### 👤 Perfil de Usuario
- Edición de información personal
- Avatar personalizable (hasta 5MB)
- Biografía y preferencias

### 📊 Dashboard
- Estadísticas visuales de uso
- Accesos rápidos a todas las funciones
- Tips de bienestar diarios
- Registro de actividad reciente

---

## 🌐 Demo

- **Frontend (Vercel)**: [nanevida.vercel.app](https://nanevida.vercel.app)
- **Backend (Railway)**: API REST (privado)

---

## 🛠 Stack Tecnológico

### Frontend
- **React** 18.3.1 - UI Library
- **TypeScript** 5.5.3 - Type Safety
- **Vite** 5.4.2 - Build Tool
- **React Router** 6.26.1 - Routing
- **Axios** 1.7.7 - HTTP Client
- **Tailwind CSS** 3.4.10 - Styling

### Backend
- **Django** 5.0+ - Web Framework
- **Django REST Framework** 3.15+ - API
- **PostgreSQL** 15+ - Database
- **SimpleJWT** 5.3+ - Authentication
- **Gunicorn** 21.2+ - WSGI Server

### DevOps
- **Vercel**: Frontend Hosting (CDN Global)
- **Railway**: Backend Hosting (Auto-deploy)
- **GitHub**: Version Control

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- Python 3.11+
- PostgreSQL 15+
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Yane2410/nane-vida-mvp.git
cd nane-vida-mvp
```

### 2. Configurar Backend

```bash
cd nanevida-backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Migrar base de datos
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

**Backend corriendo en**: `http://localhost:8000`

### 3. Configurar Frontend

```bash
cd nanevida-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Configurar VITE_API_URL=http://localhost:8000

# Iniciar servidor de desarrollo
npm run dev
```

**Frontend corriendo en**: `http://localhost:5173`

---

## 🚀 Uso

### Desarrollo Local

#### Backend
```bash
# Servidor de desarrollo
python manage.py runserver

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Tests
python manage.py test
```

#### Frontend
```bash
# Servidor dev con HMR
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Type checking
npx tsc --noEmit
```

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────┐
│          CLIENTE (React SPA)            │
│  ┌─────────┐  ┌────────┐  ┌─────────┐  │
│  │  Pages  │  │  Comp  │  │   API   │  │
│  │ (14)    │  │  (20+) │  │  Layer  │  │
│  └─────────┘  └────────┘  └─────────┘  │
└─────────────────────────────────────────┘
              ↓ HTTPS/REST ↓
┌─────────────────────────────────────────┐
│        SERVIDOR (Django REST)           │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │  Views  │  │  Serial  │  │ Models │ │
│  │  (API)  │  │  izers   │  │  (ORM) │ │
│  └─────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
              ↓ SQL ↓
┌─────────────────────────────────────────┐
│       BASE DE DATOS (PostgreSQL)        │
│  - Users  - Entries  - SOS Resources    │
└─────────────────────────────────────────┘
```

### Estructura de Carpetas

```
nanevida-frontend/src/
├── pages/              # 14 páginas de rutas
├── components/
│   ├── ui/            # Componentes base
│   └── ...            # Componentes de lógica
├── assets/icons/      # 15+ SVG icons
├── api.ts             # Cliente HTTP
├── theme.ts           # Design system
└── styles.css         # Estilos globales

nanevida-backend/
├── nanevida/          # Configuración Django
├── core/              # App principal
│   ├── models.py      # Modelos de datos
│   ├── views.py       # API endpoints
│   ├── serializers.py # Validación
│   └── urls.py        # Rutas
└── requirements.txt   # Dependencias
```

---

## 🔒 Seguridad

### Autenticación
- **JWT**: Stateless authentication
- **Access tokens**: 1 hora
- **Refresh tokens**: 7 días
- **Blacklisting**: Tokens invalidados tras logout

### Medidas Implementadas
- ✅ CORS configurado
- ✅ CSRF protection
- ✅ SQL Injection prevention
- ✅ XSS protection
- ✅ Password hashing (bcrypt)
- ✅ HTTPS enforced

---

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1 AA
- ✅ Contraste de color > 4.5:1
- ✅ Botones táctiles 44px+
- ✅ Focus indicators visibles
- ✅ Navegación por teclado
- ✅ Semántica HTML5

---

## 📊 Métricas de Rendimiento

### Build Metrics
- **Tiempo de build**: 24.18s
- **CSS gzip**: 6.91 kB (82.7% reducción)
- **JS gzip**: 132.14 kB (72.8% reducción)
- **Total bundle**: 139.05 kB

### Core Web Vitals
- **LCP**: ~1.2s (< 2.5s ✅)
- **FID**: ~80ms (< 100ms ✅)
- **CLS**: ~0.05 (< 0.1 ✅)

---

## 📚 Documentación

- **[INFORME_TECNICO.md](./INFORME_TECNICO.md)**: Documentación técnica completa
  - Arquitectura detallada
  - Seguridad y autenticación
  - Metodologías de desarrollo
  - Buenas prácticas
  - Testing y calidad
  - Deploy y DevOps

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'feat: Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Abre un Pull Request

### Convención de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato (no afecta código)
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

---

## 📄 Licencia

Este proyecto es propiedad de **NANE VIDA**. Todos los derechos reservados.

---

## 📞 Contacto

- **Repositorio**: [github.com/Yane2410/nane-vida-mvp](https://github.com/Yane2410/nane-vida-mvp)
- **Website**: [nanevida.vercel.app](https://nanevida.vercel.app)
- **Issues**: [Issues](https://github.com/Yane2410/nane-vida-mvp/issues)

---

## 🗺 Roadmap

### v1.1 (Q1 2025)
- [ ] Testing automatizado completo
- [ ] Encriptación E2E para diario
- [ ] Rate limiting en API
- [ ] PWA (Progressive Web App)

### v1.2 (Q2 2025)
- [ ] Notificaciones push
- [ ] Exportación de datos (PDF/CSV)
- [ ] Estadísticas avanzadas
- [ ] Modo oscuro

### v2.0 (Q3 2025)
- [ ] Comunidad
- [ ] Gamificación suave
- [ ] IA para insights
- [ ] Internacionalización (EN/PT)

---

<div align="center">
  <p>Hecho con 💜 por el equipo de NANE VIDA</p>
  <p><strong>Tu bienestar emocional importa</strong></p>
</div>
