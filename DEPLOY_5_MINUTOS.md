# ⚡ DEPLOY EN 5 MINUTOS - GUÍA EXPRESS

## 🎯 PASO 1: NEON DATABASE (1 min)

1. https://neon.tech → Sign Up
2. New Project → `nane-vida-prod`
3. **COPIA** esta URL completa:
   ```
   postgresql://user:pass@ep-xxx.neon.tech/nanedb?sslmode=require
   ```

---

## 🚂 PASO 2: RAILWAY BACKEND (2 min)

1. https://railway.app → "New Project"
2. "Deploy from GitHub" → `Yane2410/nane-vida-mvp`
3. **Variables** (pega todo junto):
   
```plaintext
SECRET_KEY=un8wc*+qz1824$66eke$%9upv2c36zp4+_(o_=b0r7tg#$2-8r
DJANGO_ENV=production
DEBUG=False
ALLOWED_HOSTS=.railway.app
DATABASE_URL=PEGA_TU_URL_DE_NEON_AQUI
FRONTEND_ORIGIN=https://nane-vida.vercel.app
JWT_ACCESS_LIFETIME_MINUTES=15
JWT_REFRESH_LIFETIME_DAYS=7
RATELIMIT_ENABLE=True
```

4. **Guarda** y espera deploy (2-3 min)
5. **COPIA** tu URL: `https://nane-backend-production-xxx.up.railway.app`

---

## ▲ PASO 3: VERCEL FRONTEND (2 min)

1. https://vercel.com → "New Project"
2. Import `Yane2410/nane-vida-mvp`
3. **Settings**:
   - Root Directory: `nanevida-frontend`
   - Framework: Vite
4. **Environment Variables**:
   
```plaintext
VITE_API_BASE=https://TU_URL_RAILWAY.up.railway.app/api
VITE_ENV=production
```

5. Deploy! (1-2 min)
6. **COPIA** tu URL: `https://nane-vida-xxx.vercel.app`

---

## 🔄 PASO 4: ACTUALIZAR RAILWAY (30 seg)

Vuelve a Railway y actualiza estas 2 variables:

```plaintext
FRONTEND_ORIGIN=https://nane-vida-xxx.vercel.app
BACKEND_ORIGIN=https://nane-backend-production-xxx.up.railway.app
```

---

## ✅ VERIFICAR

**Backend**: https://tu-railway.up.railway.app/api/sos/
**Frontend**: https://tu-vercel.vercel.app

---

## 🆘 Si algo falla

### Backend no inicia
- Railway → Logs → busca el error
- Verifica que `DATABASE_URL` tenga `?sslmode=require`

### Frontend no conecta
- Verifica que `VITE_API_BASE` termine en `/api`
- Verifica que `FRONTEND_ORIGIN` en Railway coincida

### CORS error
- `FRONTEND_ORIGIN` en Railway debe ser tu URL de Vercel EXACTA

---

## 🎉 ¡LISTO!

**Costo Total**: $0 (planes gratis)
**Tiempo**: ~5 minutos
**Tu app está LIVE**: ✅

---

## 📝 Crear Admin

En Railway → Project → Shell:
```bash
python manage.py createsuperuser
```

Luego accede: `https://tu-railway.up.railway.app/admin`

---

## 🔗 Links Importantes

- **Neon Dashboard**: https://console.neon.tech
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**¿Necesitas ayuda?** Ver `DEPLOYMENT.md` para guía detallada
