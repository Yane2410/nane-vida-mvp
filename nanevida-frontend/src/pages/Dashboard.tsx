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
      const [statsRes, profileRes] = await Promise.all([
        api.get('/entries/stats/'),
        api.get('/profile/')
      ])
      setStats(statsRes.data)
      setProfile(profileRes.data)
    } catch (e: any) {
      if (e?.response?.status === 404) {
        // Si no existe el endpoint de stats, usar valores por defecto
        setStats({
          total_entries: 0,
          entries_this_week: 0,
          entries_this_month: 0,
          streak_days: 0
        })
        try {
          const profileRes = await api.get('/profile/')
          setProfile(profileRes.data)
        } catch {
          setError('Error al cargar el perfil')
        }
      } else {
        setError('Error al cargar el dashboard')
      }
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
      <Card gradient className="text-center">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar" 
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400 flex items-center justify-center text-4xl border-4 border-white shadow-lg">
              👤
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              ¡Hola, {profile?.username}! 👋
            </h1>
            <p className="text-gray-600">
              Miembro desde {memberSince}
            </p>
            {profile?.bio && (
              <p className="text-sm text-gray-500 mt-2 italic max-w-md">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <Card hover className="text-center">
          <div className="text-5xl mb-3">📝</div>
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {stats?.total_entries || 0}
          </div>
          <div className="text-sm text-gray-600">Entradas Totales</div>
        </Card>

        {/* This Week */}
        <Card hover className="text-center">
          <div className="text-5xl mb-3">📅</div>
          <div className="text-3xl font-bold text-emerald-600 mb-1">
            {stats?.entries_this_week || 0}
          </div>
          <div className="text-sm text-gray-600">Esta Semana</div>
        </Card>

        {/* This Month */}
        <Card hover className="text-center">
          <div className="text-5xl mb-3">🗓️</div>
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {stats?.entries_this_month || 0}
          </div>
          <div className="text-sm text-gray-600">Este Mes</div>
        </Card>

        {/* Streak */}
        <Card hover className="text-center">
          <div className="text-5xl mb-3">🔥</div>
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {stats?.streak_days || 0}
          </div>
          <div className="text-sm text-gray-600">Racha (días)</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⚡</span>
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

          <Button 
            variant="ghost" 
            size="lg" 
            fullWidth 
            icon={<span>📊</span>}
            onClick={() => alert('Estadísticas detalladas próximamente...')}
          >
            Estadísticas
          </Button>

          <Button 
            variant="ghost" 
            size="lg" 
            fullWidth 
            icon={<span>⚙️</span>}
            onClick={() => alert('Configuración próximamente...')}
          >
            Configuración
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      {stats?.last_entry_date && (
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🕒</span>
            Actividad Reciente
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>Última entrada:</strong>{' '}
              {new Date(stats.last_entry_date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {stats.average_mood && (
              <p className="text-gray-700 mt-2">
                <strong>Estado de ánimo promedio:</strong> {stats.average_mood}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-purple-50 to-emerald-50 border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>💡</span>
          Consejo del Día
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Escribir en tu diario regularmente puede ayudarte a procesar emociones, 
          reducir el estrés y mejorar tu bienestar mental. ¡Intenta escribir al menos 
          una entrada por semana!
        </p>
      </Card>
    </div>
  )
}
