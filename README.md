# NANE VIDA – MVP (Backend + Frontend)

## Requisitos
- Python 3.10+
- Node 18+
- (Opcional) PostgreSQL si decides no usar SQLite

## 1) Backend (Django REST + JWT)
```bash
cd nanevida-backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # crea tu usuario admin
python manage.py runserver 0.0.0.0:8000
```

### Endpoints clave
- POST `/api/token/`  → {"username","password"} devuelve access/refresh
- GET/POST `/api/entries/` → Diario (autenticado)
- DELETE `/api/entries/{id}/` → Borrar entrada (autenticado)
- GET `/api/sos/` → Recursos SOS (público)

> Si usas Postgres, configura `DATABASE_URL` en `.env` (copia `.env.example`).

## 2) Frontend (React + TS + Vite)
```bash
cd nanevida-frontend
npm i
npm run dev
```
Crea `.env` con:
```
VITE_API_BASE=http://127.0.0.1:8000/api
```

## 3) Pruebas manuales sugeridas (E2E)
- Login válido/ inválido
- Crear/editar/eliminar entrada
- Ver entrada de otra cuenta (debe fallar 403)
- Ver SOS

## 4) Notas
- CORS está habilitado para `http://localhost:5173` por defecto.
- Permisos: Diario solo para dueño del recurso.
- SOS es de solo lectura y público.

¡Éxitos!