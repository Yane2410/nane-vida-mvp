import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import AppHeader from '../components/ui/AppHeader'
import EmotionalCard from '../components/ui/EmotionalCard'
import GardenWidget from '../components/GardenWidget'
import {
  JournalIcon,
  HeartIcon,
  CalmIcon,
  SparkleIcon,
} from '../assets/icons'

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

  const loadDashboard = useCallback(async () => {
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
  }, [])

  // Memoize computed values
  const memberSince = useMemo(() => {
    if (!profile?.created_at) return ''
    const date = new Date(profile.created_at)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  }, [profile?.created_at])

  const streakMessage = useMemo(() => {
    const days = stats?.streak_days || 0
    if (days === 0) return '¡Comienza tu racha hoy!'
    if (days === 1) return '¡1 día de racha!'
    return `¡${days} días de racha!`
  }, [stats?.streak_days])

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
        <div className="text-5xl mb-4" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>😔</div>
        <h3 className="text-xl font-bold text-[#333333] mb-3">
          Algo no salió como esperábamos
        </h3>
        <p className="text-[#555555] mb-6">{error}</p>
        <Button variant="primary" onClick={loadDashboard}>
          Intentar nuevamente
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <AppHeader 
        greeting={`Hola, ${profile?.username}`}
        subtitle="Tu espacio personal de bienestar. Estamos aquí para acompañarte."
      />

      {/* Profile Card */}
      <Card gradient className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {profile?.avatar ? (
            <img 
              src={profile.avatar} 
              alt="Avatar"
              loading="lazy"
              decoding="async"
              className="w-20 h-20 rounded-2xl border-4 border-white/60 shadow-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD] flex items-center justify-center text-4xl border-4 border-white/60 shadow-lg">
              <HeartIcon size={32} color="white" />
            </div>
          )}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-[#333333] mb-1">
              {profile?.username}
            </h2>
            <p className="text-[#555555] text-sm mb-2">
              Miembro desde {memberSince}
            </p>
            {profile?.bio && (
              <p className="text-sm text-[#666666] italic bg-white/60 px-4 py-2 rounded-xl max-w-xl">
                "{profile.bio}"
              </p>
            )}
          </div>
          <Link to="/profile">
            <Button variant="secondary" size="sm">
              Editar perfil
            </Button>
          </Link>
        </div>
      </Card>

      {/* Garden Widget */}
      <GardenWidget />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Entries */}
        <Card hover className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📝</div>
          <div className="text-3xl font-bold text-[#A78BFA] mb-1">
            {stats?.total_entries || 0}
          </div>
          <div className="text-sm text-[#555555] font-medium">Entradas totales</div>
        </Card>

        {/* This Week */}
        <Card hover className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📅</div>
          <div className="text-3xl font-bold text-[#7DD3FC] mb-1">
            {stats?.entries_this_week || 0}
          </div>
          <div className="text-sm text-[#555555] font-medium">Esta semana</div>
        </Card>

        {/* This Month */}
        <Card hover className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🗓️</div>
          <div className="text-3xl font-bold text-[#FBCFE8] mb-1">
            {stats?.entries_this_month || 0}
          </div>
          <div className="text-sm text-[#555555] font-medium">Este mes</div>
        </Card>

        {/* Streak */}
        <Card hover className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🔥</div>
          <div className="text-3xl font-bold text-[#FED7AA] mb-1">
            {stats?.streak_days || 0}
          </div>
          <div className="text-sm text-[#555555] font-medium">Racha (días)</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-[#333333] mb-6 text-center">
          ¿Qué te gustaría hacer hoy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmotionalCard
            title="Nueva Entrada"
            description="Escribe sobre cómo te sientes hoy. Tu voz importa."
            icon={<JournalIcon size={32} />}
            color="#A78BFA"
            href="/diary"
          />
          
          <EmotionalCard
            title="Ver mi Diario"
            description="Revisa tus entradas anteriores y observa tu progreso."
            icon={<JournalIcon size={32} />}
            color="#7DD3FC"
            href="/diary"
          />

          <EmotionalCard
            title="Ejercicios de Calma"
            description="Técnicas para encontrar paz cuando más lo necesitas."
            icon={<CalmIcon size={32} />}
            color="#BBF7D0"
            href="/calm"
          />

          <EmotionalCard
            title="Líneas de Ayuda"
            description="Acceso inmediato a recursos de apoyo profesional."
            icon={<HeartIcon size={32} />}
            color="#FBCFE8"
            href="/sos"
          />

          <EmotionalCard
            title="Mis Estadísticas"
            description="Visualiza patrones y celebra tus logros."
            icon={<SparkleIcon size={32} />}
            color="#C4B5FD"
            href="/statistics"
          />

          <EmotionalCard
            title="Configuración"
            description="Personaliza tu experiencia según tus necesidades."
            icon={<span className="text-2xl">⚙️</span>}
            color="#FED7AA"
            href="/settings"
          />
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.last_entry_date && (
        <Card>
          <h3 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
            <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🕒</span>
            <span>Actividad reciente</span>
          </h3>
          <div className="bg-gradient-to-r from-[#A78BFA]/10 to-[#C4B5FD]/10 border border-[#A78BFA]/20 rounded-2xl p-5">
            <p className="text-[#444444] font-medium">
              <strong className="text-[#A78BFA]">Última entrada:</strong>{' '}
              {new Date(stats.last_entry_date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {stats.average_mood && (
              <p className="text-[#444444] font-medium mt-2">
                <strong className="text-[#A78BFA]">Estado de ánimo promedio:</strong> {stats.average_mood}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tips Card */}
      <Card>
        <h3 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
          <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💡</span>
          <span>Recuerda</span>
        </h3>
        <p className="text-[#444444] leading-relaxed bg-gradient-to-r from-[#BBF7D0]/20 to-[#7DD3FC]/20 border border-[#BBF7D0]/30 rounded-2xl p-5">
          Escribir en tu diario es una forma poderosa de conectar contigo mismo. 
          No importa si escribes mucho o poco, lo importante es que estés aquí, 
          dándote este espacio. Cada palabra cuenta, cada sentimiento es válido. 💚
        </p>
      </Card>
    </div>
  )
}
