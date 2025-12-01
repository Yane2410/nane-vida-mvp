# 🚀 DEPLOY RÁPIDO A PRODUCCIÓN

## ⏱️ Setup en 10 minutos

### 1️⃣ Base de Datos (2 min) - NEON

1. Ve a **https://neon.tech**
2. Regístrate (GitHub/Google)
3. Click **"New Project"**
   - Name: `nane-vida-prod`
   - Region: US East (o la más cercana)
4. **COPIA** el connection string (aparece automáticamente):
   ```
   postgresql://user:pass@ep-xxx.neon.tech/nanedb?sslmode=require
   ```

---

### 2️⃣ Backend (3 min) - RAILWAY

1. Ve a **https://railway.app**
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Conecta tu cuenta GitHub y selecciona: `Yane2410/nane-vida-mvp`
4. Railway detectará Django automáticamente
5. **Variables de Entorno** (click en tu servicio → Variables):
   ```bash
   SECRET_KEY=un8wc*+qz1824$66eke$%9upv2c36zp4+_(o_=b0r7tg#$2-8r
   DJANGO_ENV=production
   DEBUG=False
   ALLOWED_HOSTS=.railway.app
   DATABASE_URL=<PEGA_AQUÍ_TU_URL_DE_NEON>
   FRONTEND_ORIGIN=https://tu-app.vercel.app
   BACKEND_ORIGIN=https://tu-backend.railway.app
   JWT_ACCESS_LIFETIME_MINUTES=15
   JWT_REFRESH_LIFETIME_DAYS=7
   RATELIMIT_ENABLE=True
   ```
6. Railway deployará automáticamente
7. **COPIA** tu URL de Railway (ejemplo: `https://nane-backend-production.railway.app`)

---

### 3️⃣ Frontend (3 min) - VERCEL

1. Ve a **https://vercel.com**
2. Click **"Add New..."** → **"Project"**
3. Importa tu repo: `Yane2410/nane-vida-mvp`
4. **Settings**:
   - Framework Preset: **Vite**
   - Root Directory: **nanevida-frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables**:
   ```bash
   VITE_API_BASE=https://tu-backend.railway.app/api
   VITE_ENV=production
   ```
6. Click **"Deploy"**
7. **COPIA** tu URL de Vercel (ejemplo: `https://nane-vida.vercel.app`)

---

### 4️⃣ Actualizar URLs (2 min)

**Vuelve a Railway** y actualiza estas variables:
```bash
FRONTEND_ORIGIN=https://nane-vida.vercel.app    # Tu URL real de Vercel
BACKEND_ORIGIN=https://nane-backend-production.railway.app  # Tu URL real de Railway
ALLOWED_HOSTS=.railway.app,nane-backend-production.railway.app
```

Railway redesplegará automáticamente.

---

## ✅ Verificar Deployment

### Backend:
```bash
# Test endpoint
curl https://tu-backend.railway.app/api/sos/
```

### Frontend:
Abre: `https://tu-app.vercel.app`

---

## 🔧 Comandos Útiles

### Ejecutar migraciones en Railway:
```bash
# En Railway dashboard:
# Settings → Deploy → Run Command
python manage.py migrate
```

### Crear superusuario:
```bash
python manage.py createsuperuser
```

### Ver logs:
```bash
# Railway: Click en tu servicio → "Logs"
# Vercel: Tu proyecto → "Deployments" → Click deployment → "Logs"
```

---

## 🆘 Problemas Comunes

### ❌ Error: "CORS error"
**Solución**: Verifica que `FRONTEND_ORIGIN` en Railway coincida con tu URL de Vercel

### ❌ Error: "Database connection failed"
**Solución**: Verifica que `DATABASE_URL` de Neon esté correcta y tenga `?sslmode=require`

### ❌ Error: "DisallowedHost"
**Solución**: Agrega tu dominio a `ALLOWED_HOSTS` en Railway

### ❌ Error: "Static files not found"
**Solución**: Railway ejecutará `collectstatic` automáticamente. Verifica logs.

---

## 📊 Costos

| Servicio | Plan Gratis | Límite |
|----------|-------------|--------|
| **Neon** | ✅ | 10 GB, 100 horas/mes |
| **Railway** | ✅ | $5 crédito, ~500 horas |
| **Vercel** | ✅ | 100 GB bandwidth |

**Total**: **GRATIS** para empezar 🎉

---

## 🔒 Seguridad Checklist

- ✅ DEBUG=False en producción
- ✅ SECRET_KEY única
- ✅ ALLOWED_HOSTS configurado
- ✅ DATABASE_URL con sslmode=require
- ✅ CORS configurado correctamente
- ✅ JWT tokens con expiración
- ✅ Rate limiting activado
- ✅ HTTPS automático (Vercel + Railway)

---

## 📱 URLs de Tu Aplicación

Después del deploy tendrás:

- **Frontend**: `https://nane-vida.vercel.app`
- **Backend**: `https://nane-backend-production.railway.app`
- **Admin**: `https://nane-backend-production.railway.app/admin`
- **API Docs**: `https://nane-backend-production.railway.app/api/`

---

## 🎯 Siguiente Paso

**Crear superusuario en producción:**

1. Ve a Railway → Tu servicio → "Settings"
2. Scroll a "Custom Start Command"
3. Temporalmente cambia a:
   ```bash
   python manage.py createsuperuser --noinput --username admin --email admin@nane.com; gunicorn nane.wsgi:application
   ```
4. Guarda y espera redeploy
5. Revierte al comando original de gunicorn

O usa Railway CLI:
```bash
railway run python manage.py createsuperuser
```

---

## 📞 Soporte Rápido

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs

---

**🚀 ¡Listo! Tu app está en producción en menos de 10 minutos!**
