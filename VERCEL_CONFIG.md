# Configuración de Vercel para NANE VIDA MVP

## 🚀 Variables de Entorno Requeridas

Para que el frontend de Vercel se comunique correctamente con el backend de Railway, necesitas configurar las siguientes variables de entorno en tu proyecto de Vercel:

### 1. Variable Principal: API Base URL

```
Nombre: VITE_API_BASE
Valor: https://nane-vida-mvp-production.up.railway.app/api
Entornos: ✅ Production ✅ Preview ✅ Development
```

## 📝 Pasos para Configurar en Vercel

### Opción A: Desde el Dashboard de Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto `nane-vida-mvp` (o el nombre que tenga)
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Configura:
   - **Key (Name)**: `VITE_API_BASE`
   - **Value**: `https://nane-vida-mvp-production.up.railway.app/api`
   - **Environments**: Marca todas (Production, Preview, Development)
6. Haz clic en **Save**
7. Ve a **Deployments** y haz clic en **Redeploy** en el deployment más reciente

### Opción B: Desde la CLI de Vercel

```bash
# Instalar Vercel CLI si no la tienes
npm i -g vercel

# Login
vercel login

# Configurar variables de entorno
vercel env add VITE_API_BASE production
# Pega: https://nane-vida-mvp-production.up.railway.app/api

vercel env add VITE_API_BASE preview
# Pega: https://nane-vida-mvp-production.up.railway.app/api

vercel env add VITE_API_BASE development
# Pega: https://nane-vida-mvp-production.up.railway.app/api

# Redesplegar
vercel --prod
```

## ✅ Verificación

Después de configurar y redesplegar:

1. **Verifica que la variable esté configurada**:
   - Ve a Settings → Environment Variables
   - Deberías ver `VITE_API_BASE` listada

2. **Verifica el deployment**:
   - Ve a tu sitio en Vercel (ej: https://nane-vida-mvp.vercel.app)
   - Abre las Developer Tools del navegador (F12)
   - Ve a la pestaña **Console**
   - Deberías ver peticiones a `https://nane-vida-mvp-production.up.railway.app/api`
   - **NO** deberías ver errores CORS

3. **Prueba la funcionalidad**:
   - Intenta hacer login
   - Verifica que las peticiones se completen exitosamente
   - No deberías ver errores de CORS ni "Failed to load resource"

## 🔧 Cambios Realizados en el Backend

Ya se desplegaron los siguientes cambios en Railway para solucionar CORS:

- ✅ `CORS_ALLOWED_ORIGIN_REGEXES` acepta todos los subdominios `*.vercel.app`
- ✅ `CSRF_COOKIE_SAMESITE = "None"` permite cross-site cookies
- ✅ `SESSION_COOKIE_SAMESITE = "None"` permite sesiones cross-site
- ✅ `CORS_ALLOW_METHODS` configurado con todos los métodos HTTP
- ✅ `CORS_EXPOSE_HEADERS` configurado para headers necesarios
- ✅ `CORS_PREFLIGHT_MAX_AGE` configurado para mejor performance

## 🐛 Solución de Problemas

### Si sigues viendo errores CORS:

1. **Verifica que Railway haya terminado de redesplegar**:
   - Ve a https://railway.app/dashboard
   - Busca tu proyecto `nane-vida-mvp`
   - Verifica que el deployment esté en estado "Active" (verde)

2. **Limpia la caché del navegador**:
   - Presiona `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
   - O ve a Developer Tools → Network → marca "Disable cache"

3. **Verifica las variables de entorno**:
   - En Vercel, ve a Settings → Environment Variables
   - Confirma que `VITE_API_BASE` esté configurada correctamente
   - Si hiciste cambios, **debes redesplegar** para que surtan efecto

4. **Verifica los logs de Railway**:
   - Ve a tu proyecto en Railway
   - Haz clic en **View Logs**
   - Busca errores relacionados con CORS o Django

### Si ves errores de "401 Unauthorized":

Esto es **normal** si no has iniciado sesión. Los errores CORS ya están solucionados.

### Si ves errores de "Failed to load resource":

1. Verifica que la URL del backend sea correcta:
   ```
   https://nane-vida-mvp-production.up.railway.app/api
   ```
2. Intenta acceder manualmente a:
   ```
   https://nane-vida-mvp-production.up.railway.app/api/sos/
   ```
   Deberías ver una respuesta JSON (aunque sea un error 401).

## 📱 URLs de Producción

- **Frontend (Vercel)**: https://nane-vida-mvp.vercel.app (o tu URL personalizada)
- **Backend (Railway)**: https://nane-vida-mvp-production.up.railway.app
- **API Base**: https://nane-vida-mvp-production.up.railway.app/api

## 🔐 Nota de Seguridad

Los cambios de CORS **solo** permiten:
- Dominios `*.vercel.app` (tus deployments de Vercel)
- Localhost (para desarrollo local)

Cualquier otro dominio será bloqueado automáticamente por el backend.
