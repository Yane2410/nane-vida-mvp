import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type DashboardStats = {
  total_entries: number
  entries_this_week: number
  entries_this_month: number
  streak_days: number
  average_mood?: string
  last_entry_date?: string
}

type UserProfile = {
  username: string
  email: string
  bio: string
  avatar: string | null
  created_at: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      // Intentar cargar stats y profile
      const profileRes = await api.get('/profile/')
      setProfile(profileRes.data)
      
      // Intentar cargar stats (puede no existir el endpoint)
      try {
        const statsRes = await api.get('/entries/stats/')
        setStats(statsRes.data)
      } catch (statsError: any) {
        // Si no existe el endpoint, usar valores por defecto
        console.log('Stats endpoint no disponible, usando valores por defecto')
        setStats({
          total_entries: 0,
          entries_this_week: 0,
          entries_this_month: 0,
          streak_days: 0
        })
      }
    } catch (e: any) {
      console.error('Error loading dashboard:', e)
      // Si falla el profile, mostrar valores por defecto para todo
      setError('Error al cargar el dashboard. Verifica tu conexión.')
      setStats({
        total_entries: 0,
        entries_this_week: 0,
        entries_this_month: 0,
        streak_days: 0
      })
      setProfile({
        username: 'Usuario',
        email: '',
        bio: '',
        avatar: null,
        created_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Cargando dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center">
        <p className="text-red-600 mb-4">⚠️ {error}</p>
        <Button variant="secondary" onClick={loadDashboard}>
          Reintentar
        </Button>
      </Card>
    )
  }

  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Desconocido'

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card gradient className="relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-2xl border-4 border-white/60 shadow-2xl object-cover ring-4 ring-indigo-500/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-5xl border-4 border-white/60 shadow-2xl ring-4 ring-indigo-500/20">
              👤
            </div>
          )}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              ¡Hola, {profile?.username}! 👋
            </h1>
            <p className="text-slate-600 font-medium mb-1">
              Miembro desde {memberSince}
            </p>
            {profile?.bio && (
              <p className="text-sm text-slate-500 mt-3 italic max-w-2xl bg-white/50 px-4 py-2 rounded-lg">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <Card hover className="text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-5xl mb-3">📝</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              {stats?.total_entries || 0}
            </div>
            <div className="text-sm text-slate-600 font-semibold">Entradas Totales</div>
          </div>
        </Card>

        {/* This Week */}
        <Card hover className="text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-5xl mb-3">📅</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              {stats?.entries_this_week || 0}
            </div>
            <div className="text-sm text-slate-600 font-semibold">Esta Semana</div>
          </div>
        </Card>

        {/* This Month */}
        <Card hover className="text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-5xl mb-3">🗓️</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              {stats?.entries_this_month || 0}
            </div>
            <div className="text-sm text-slate-600 font-semibold">Este Mes</div>
          </div>
        </Card>

        {/* Streak */}
        <Card hover className="text-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <div className="text-5xl mb-3">🔥</div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
              {stats?.streak_days || 0}
            </div>
            <div className="text-sm text-slate-600 font-semibold">Racha (días)</div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <span>Acciones Rápidas</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/diary">
            <Button variant="primary" size="lg" fullWidth icon={<span>✍️</span>}>
              Nueva Entrada
            </Button>
          </Link>
          
          <Link to="/diary">
            <Button variant="secondary" size="lg" fullWidth icon={<span>📔</span>}>
              Ver Diario
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="secondary" size="lg" fullWidth icon={<span>👤</span>}>
              Editar Perfil
            </Button>
          </Link>

          <Link to="/sos">
            <Button variant="danger" size="lg" fullWidth icon={<span>🆘</span>}>
              Líneas de Ayuda
            </Button>
          </Link>

          <Link to="/statistics">
            <Button variant="secondary" size="lg" fullWidth icon={<span>📊</span>}>
              Estadísticas
            </Button>
          </Link>

          <Link to="/settings">
            <Button variant="secondary" size="lg" fullWidth icon={<span>⚙️</span>}>
              Configuración
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      {stats?.last_entry_date && (
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🕒</span>
              <span>Actividad Reciente</span>
            </h3>
            <div className="bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border border-indigo-200/40 rounded-xl p-5">
              <p className="text-slate-700 font-medium">
                <strong className="text-indigo-600">Última entrada:</strong>{' '}
                {new Date(stats.last_entry_date).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {stats.average_mood && (
                <p className="text-slate-700 font-medium mt-2">
                  <strong className="text-purple-600">Estado de ánimo promedio:</strong> {stats.average_mood}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-2xl" />
        <div className="relative">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span>Consejo del Día</span>
          </h3>
          <p className="text-slate-700 leading-relaxed font-medium bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-5">
            Escribir en tu diario regularmente puede ayudarte a procesar emociones, 
            reducir el estrés y mejorar tu bienestar mental. ¡Intenta escribir al menos 
            una entrada por semana!
          </p>
        </div>
      </Card>
    </div>
  )
}
