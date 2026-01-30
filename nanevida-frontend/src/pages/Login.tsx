import { useState, useEffect, useRef } from 'react'
import { api, setTokens, getReadableError, setSlowRequestCallback } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import { startTrial } from '../config/trial'
import { isDev } from '../config/env'
import Card from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import { smoothNavigate } from '../utils/navigation'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slowWarning, setSlowWarning] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ok' | 'down'>('checking')
  const nav = useNavigate()
  
  // 🔒 INTEGRITY: Anti-doble submit
  const isSubmitting = useRef(false)
  // 🛡️ STABILITY: Prevenir setState después de unmount
  const isMounted = useRef(true)

  // Health check backend en DEV (FASE 4)
  useEffect(() => {
    if (isDev()) {
      api.get('/health/')
        .then(() => setBackendStatus('ok'))
        .catch(() => setBackendStatus('down'))
    } else {
      setBackendStatus('ok') // PROD: asumir ok, no hacer health checks
    }
  }, [])

  // Detectar backend dormido (Render free tier)
  useEffect(() => {
    setSlowRequestCallback((url) => {
      if (url.includes('/token/') && isMounted.current) {
        setSlowWarning(true)
      }
    })
    return () => {
      setSlowRequestCallback(null)
      isMounted.current = false
    }
  }, [])

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    
    // 🔒 INTEGRITY: Bloquear múltiples submits
    if (isSubmitting.current) return
    
    isSubmitting.current = true
    setError('')
    setSlowWarning(false)
    setLoading(true)
    
    try {
      const { data } = await api.post('/token/', { username, password })
      
      // 🛡️ STABILITY: Solo actualizar estado si componente montado
      if (!isMounted.current) return
      
      // VALIDATION: Verificar estructura del response
      if (!data || !data.access) {
        throw new Error('Respuesta del servidor invalida')
      }
      
      setTokens(data.access, data.refresh)
      
      // 🔐 SECURITY: Username en sessionStorage (se borra al cerrar tab)
      sessionStorage.setItem('nane_username', username)
      
      // Activar trial automáticamente al login exitoso
      startTrial()
      
      // ✅ FIX: Terminar loading ANTES de navegar para que usuario vea feedback
      // y evitar race condition con GardenContext (que carga al montar /dashboard)
      setLoading(false)
      isSubmitting.current = false
      
      smoothNavigate(() => nav('/dashboard'))
    } catch (err) {
      if (!isMounted.current) return
      setError(getReadableError(err))
      setSlowWarning(false)
    } finally {
      // 🛡️ STABILITY: Asegurar que loading siempre se limpia
      if (isMounted.current) {
        setLoading(false)
      }
      isSubmitting.current = false
    }
  }

  const handleClear = () => {
    setUsername('')
    setPassword('')
    setError('')
  }

  return (
    <div className="max-w-md mx-auto animate-page">
      {/* Botón volver */}
      <div className="mb-4">
        <button
          onClick={() => nav('/')}
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
        >
          Volver
        </button>
      </div>

      {/* Backend health check (DEV only, FASE 4) */}
      {isDev() && backendStatus === 'down' && !error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50/40 dark:bg-red-900/20 border border-red-200/60 dark:border-red-700/60">
          <p className="text-sm text-slate-900 dark:text-white">
            No pudimos conectar con el backend local.
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
            Verifica que Django esta corriendo en <code className="bg-black/10 dark:bg-white/10 px-1 rounded">:8000</code>
          </p>
          <button
            onClick={() => {
              setBackendStatus('checking')
              api.get('/health/')
                .then(() => setBackendStatus('ok'))
                .catch(() => setBackendStatus('down'))
            }}
            className="text-xs text-purple-600 dark:text-purple-400 mt-2 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <Card gradient className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <img 
            src="/icons/logo-icon.png" 
            alt="Nane Vida" 
            className="h-20 w-auto rounded-2xl"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
          Nos alegra verte de nuevo
        </h2>
        <p className="text-slate-800 dark:text-slate-100 text-base">
          Tu espacio de bienestar te está esperando
        </p>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
          Tu espacio personal. Sin ruido. Sin juicios.
        </p>
      </Card>

      <Card>
        {/* Slow backend warning (Render free tier) */}
        {slowWarning && !error && (
          <div className="mb-4 p-3 rounded-xl bg-blue-50/40 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/60">
            <p className="text-sm text-slate-900 dark:text-white">
              Estamos preparando todo, esto puede tardar unos segundos...
            </p>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Usuario"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            placeholder="tu_usuario"
            required
            disabled={loading}
          />

          <Input
            label="Contrasena"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={loading}
          />

          {error && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl animate-scale-in">
              <p className="text-amber-900 dark:text-amber-100 text-sm">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>

          {/* Trust micro-copy */}
          <p className="text-xs text-center text-slate-600 dark:text-slate-400 mt-4">
            Tus datos estan protegidos y no se comparten con terceros
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-[#A78BFA]/20">
          <div className="text-center space-y-3">
            <p className="text-slate-800 dark:text-slate-100 text-sm">
              Primera vez aqui?
            </p>
            <Link to="/register">
              <Button variant="success" fullWidth>
                Crear mi cuenta
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
