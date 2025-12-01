# ✅ CHECKLIST DE PRODUCCIÓN

## 📋 Antes de Deploy

### Backend
- [x] SECRET_KEY única generada
- [x] DEBUG=False
- [x] ALLOWED_HOSTS configurado
- [x] Base de datos PostgreSQL (Neon)
- [x] DATABASE_URL con sslmode=require
- [x] CORS configurado
- [x] CSP headers
- [x] Rate limiting activado
- [x] JWT configurado
- [x] Argon2 password hashing
- [ ] Migrations ejecutadas en producción
- [ ] Superusuario creado

### Frontend
- [ ] VITE_API_BASE apunta a producción
- [ ] Build exitoso (`npm run build`)
- [ ] Variables de entorno configuradas
- [ ] Vercel.json con headers de seguridad

### Base de Datos (Neon)
- [ ] Proyecto creado
- [ ] DATABASE_URL copiada
- [ ] Connection string probada

---

## 🚀 Deployment Steps

### 1. Neon (Database)
```bash
✅ Cuenta creada
✅ Proyecto: nane-vida-prod
✅ DATABASE_URL copiada
```

### 2. Railway (Backend)
```bash
✅ Repo conectado
✅ Variables de entorno configuradas
✅ Build exitoso
✅ Health check: /api/sos/ responde
```

### 3. Vercel (Frontend)
```bash
✅ Repo conectado
✅ Root directory: nanevida-frontend
✅ Variables configuradas
✅ Deploy exitoso
✅ App carga correctamente
```

---

## 🔒 Seguridad Post-Deploy

- [ ] Cambiar SECRET_KEY de producción
- [ ] Verificar HTTPS en ambos servicios
- [ ] Probar CORS entre frontend y backend
- [ ] Verificar CSP headers (F12 → Network)
- [ ] Probar rate limiting (hacer 100+ requests)
- [ ] Verificar JWT expira correctamente
- [ ] Probar login/logout
- [ ] Verificar tokens refresh

---

## 🧪 Testing Post-Deploy

### Backend Endpoints
```bash
# Test público
curl https://tu-backend.railway.app/api/sos/

# Test autenticación
curl https://tu-backend.railway.app/api/entries/
# Debe retornar 401 Unauthorized

# Test admin
https://tu-backend.railway.app/admin
```

### Frontend
```bash
# Abrir en navegador
https://tu-frontend.vercel.app

# Probar:
1. Registro de usuario
2. Login
3. Crear entrada
4. Ver entradas
5. Recursos SOS
6. Logout
```

---

## 📊 Monitoring

### Railway
- [ ] Logs sin errores críticos
- [ ] CPU < 80%
- [ ] Memory < 512 MB
- [ ] Response time < 500ms

### Vercel
- [ ] Build successful
- [ ] Deployment activo
- [ ] Sin errores en logs
- [ ] Lighthouse score > 80

### Neon
- [ ] Conexiones < límite
- [ ] Storage < 10GB
- [ ] Queries sin errores

---

## 🆘 Troubleshooting Checklist

### Error: CORS
```bash
✓ FRONTEND_ORIGIN en Railway = URL de Vercel
✓ BACKEND_ORIGIN en Railway = URL de Railway
✓ CORS_ALLOWED_ORIGINS incluye frontend
```

### Error: Database Connection
```bash
✓ DATABASE_URL correcta
✓ Tiene ?sslmode=require
✓ User/password correctos
✓ Neon database no pausada
```

### Error: 500 Internal Server Error
```bash
✓ Ver logs en Railway
✓ Migrations ejecutadas
✓ ALLOWED_HOSTS incluye dominio
✓ SECRET_KEY configurada
```

### Error: Frontend no conecta
```bash
✓ VITE_API_BASE termina en /api
✓ Backend responde en esa URL
✓ CORS configurado
✓ Build y redeploy en Vercel
```

---

## 📱 URLs Finales

Guarda estas URLs:

```plaintext
FRONTEND: https://___________________.vercel.app
BACKEND:  https://___________________.up.railway.app
ADMIN:    https://___________________.up.railway.app/admin
API DOCS: https://___________________.up.railway.app/api/
NEON DB:  https://console.neon.tech/app/projects/___________
```

---

## 🎯 Performance Targets

- **Backend Response Time**: < 300ms
- **Frontend Load Time**: < 2s
- **Lighthouse Performance**: > 80
- **Lighthouse Accessibility**: > 90
- **Lighthouse Best Practices**: > 90
- **Lighthouse SEO**: > 80

---

## 📝 Post-Launch Tasks

- [ ] Configurar dominio custom (opcional)
- [ ] Configurar email SMTP (opcional)
- [ ] Configurar Sentry para error tracking
- [ ] Documentar credenciales de admin
- [ ] Backup database (Neon tiene auto-backup)
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Agregar Google Analytics (opcional)
- [ ] Configurar health checks
- [ ] Crear documentación de usuario

---

## 🔄 Maintenance

### Semanal
- [ ] Revisar logs de errores
- [ ] Verificar uso de recursos
- [ ] Revisar métricas de usuarios

### Mensual
- [ ] Actualizar dependencias
- [ ] Revisar costos de servicios
- [ ] Backup manual de base de datos
- [ ] Revisar seguridad (npm audit, pip check)

---

## 📞 Contactos de Soporte

- **Railway**: https://railway.app/help
- **Vercel**: https://vercel.com/support
- **Neon**: https://neon.tech/docs/introduction

---

## ✅ DEPLOYMENT COMPLETE!

**Status**: 🟢 Live in Production
**Date**: _____________
**Version**: 1.0.0
**Deployed by**: _____________

---

**🎉 ¡Felicidades! Tu app está en producción!**
