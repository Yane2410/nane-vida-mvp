import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api, getToken } from '../api'
import { logger } from '../utils/logger'
import { hasPremiumInterest } from '../utils/conversionTracker'
import { POST_PRICING_MESSAGE } from '../constants/pricing'
import { getDailyPresenceMessage } from '../utils/dailyPresence'
import { getPassivePresenceMessage } from '../utils/passivePresence'
import { shouldShowTrialAwareness, markTrialAwarenessShown, isTrialExpired } from '../config/trial'
import { shouldShowTrialEndingSoon, markTrialEndingSoonSeen, getTrialEndingSoonMessage } from '../utils/trialMessaging'
import TrialBadge from '../components/TrialBadge'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
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

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-32 rounded-3xl bg-gray-200/70 dark:bg-gray-800/60" />
      <div className="h-24 rounded-3xl bg-gray-200/70 dark:bg-gray-800/60" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-3xl bg-gray-200/70 dark:bg-gray-800/60" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 rounded-3xl bg-gray-200/70 dark:bg-gray-800/60" />
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPostPricingMessage, setShowPostPricingMessage] = useState(false)
  const [dailyMessage, setDailyMessage] = useState<string | null>(null)
  const [passivePresenceMessage, setPassivePresenceMessage] = useState<string | null>(null)
  const [showTrialAwareness, setShowTrialAwareness] = useState(false)
  const [showTrialEndingSoon, setShowTrialEndingSoon] = useState(false)
  const [trialEndingMessage, setTrialEndingMessage] = useState('')
  const [showPostTrialCard, setShowPostTrialCard] = useState(false)
  const location = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    loadDashboard()

    const hasInterest = hasPremiumInterest()
    const hasShownMessage = localStorage.getItem('shown_post_pricing_message') === 'true'

    if (hasInterest && !hasShownMessage) {
      setShowPostPricingMessage(true)
      localStorage.setItem('shown_post_pricing_message', 'true')
    }

    const message = getDailyPresenceMessage()
    if (message) {
      setDailyMessage(message)
    }

    const presenceMsg = getPassivePresenceMessage()
    if (presenceMsg) {
      setPassivePresenceMessage(presenceMsg)
    }

    if (shouldShowTrialEndingSoon()) {
      setShowTrialEndingSoon(true)
      setTrialEndingMessage(getTrialEndingSoonMessage())
      markTrialEndingSoonSeen()
    }

    const trialExpired = isTrialExpired()
    const notOnPricing = !location.pathname.includes('pricing')
    const notSeenThisSession = !sessionStorage.getItem('post_trial_card_seen')

    if (trialExpired && notOnPricing && notSeenThisSession) {
      setShowPostTrialCard(true)
      sessionStorage.setItem('post_trial_card_seen', 'true')
    }
  }, [])

  const loadDashboard = useCallback(async () => {
    const currentToken = getToken()
    const cachedForToken = sessionStorage.getItem('cached_for_token')

    if (cachedForToken !== currentToken) {
      sessionStorage.removeItem('profile_cache')
      sessionStorage.setItem('cached_for_token', currentToken || '')
    }

    let profileLoaded = false
    let statsLoaded = false

    try {
      const profileRes = await api.get('/profile/')
      setProfile(profileRes.data)
      sessionStorage.setItem('profile_cache', JSON.stringify(profileRes.data))
      profileLoaded = true
    } catch (profileError) {
      logger.warn('Profile endpoint failed, using fallback:', profileError)

      const cached = sessionStorage.getItem('profile_cache')
      if (cached) {
        setProfile(JSON.parse(cached))
        profileLoaded = true
      } else {
        const savedUsername = sessionStorage.getItem('nane_username') || 'Usuario'
        setProfile({
          username: savedUsername,
          email: '',
          bio: 'Bienvenido a Nane Vida',
          avatar: null,
          created_at: new Date().toISOString()
        })
      }
    }

    try {
      const statsRes = await api.get('/entries/stats/')
      setStats(statsRes.data)
      statsLoaded = true
    } catch (statsError) {
      logger.warn('Stats endpoint failed, using defaults')
      setStats({
        total_entries: 0,
        entries_this_week: 0,
        entries_this_month: 0,
        streak_days: 0
      })
    }

    if (!profileLoaded || !statsLoaded) {
      if (!profileLoaded && !statsLoaded) {
        setError('No pudimos conectar con el servidor. Algunos datos pueden estar desactualizados.')
      } else if (!profileLoaded) {
        setError('Tu perfil no se actualizo. Revisa tu conexion.')
      }
    }

    setLoading(false)
  }, [])

  const memberSince = useMemo(() => {
    if (!profile?.created_at) return ''
    const date = new Date(profile.created_at)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
  }, [profile?.created_at])

  const streakMessage = useMemo(() => {
    const days = stats?.streak_days || 0
    if (days === 0) return 'Comienza tu racha hoy'
    if (days === 1) return '1 dia de racha'
    return `${days} dias de racha`
  }, [stats?.streak_days])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <DashboardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center shadow-card">
        <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-3">
          Algo no salio como esperabamos
        </h3>
        <p className="text-ink-700 dark:text-gray-200 mb-6">{error}</p>
        <Button variant="primary" onClick={loadDashboard}>
          Intentar nuevamente
        </Button>
      </Card>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8 animate-page">
      {showPostPricingMessage && (
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 shadow-card">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-purple-700 dark:text-purple-200">
              <SparkleIcon size={20} color="currentColor" />
            </span>
            <div className="flex-1">
              <p className="text-sm text-purple-900 dark:text-purple-100 font-medium">
                {POST_PRICING_MESSAGE}
              </p>
            </div>
            <button
              onClick={() => setShowPostPricingMessage(false)}
              className="text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </Card>
      )}

      {dailyMessage && (
        <div className="text-center">
          <p className="text-sm text-ink-500 dark:text-gray-300">
            {dailyMessage}
          </p>
        </div>
      )}

      {passivePresenceMessage && (
        <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border border-gray-200 dark:border-gray-700 shadow-card">
          <div className="text-center">
            <p className="text-sm text-ink-600 dark:text-gray-300 italic">
              {passivePresenceMessage}
            </p>
          </div>
        </Card>
      )}

      {showTrialEndingSoon && (
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30 border border-slate-200 dark:border-slate-700 shadow-card">
          <div className="text-center">
            <p className="text-sm text-ink-700 dark:text-gray-300">
              {trialEndingMessage}
            </p>
          </div>
        </Card>
      )}

      {showPostTrialCard && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 shadow-card">
          <div className="text-center space-y-3">
            <div className="flex justify-center text-purple-600 dark:text-purple-200">
              <SparkleIcon size={28} color="currentColor" />
            </div>
            <h3 className="text-lg font-semibold text-ink-900 dark:text-white">
              Manten tu experiencia completa
            </h3>
            <p className="text-sm text-ink-700 dark:text-gray-300">
              Las miradas mas profundas siguen aqui cuando quieras.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setShowPostTrialCard(false)
                  nav('/pricing')
                }}
              >
                Ver experiencia completa
              </Button>
            </div>
          </div>
        </Card>
      )}

      <AppHeader
        greeting={`Hola, ${profile?.username}`}
        subtitle="Tu espacio personal de bienestar. Estamos aqui para acompanarte."
      />

      <Card gradient className="relative overflow-hidden shadow-card">
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
            <h2 className="text-2xl font-bold text-ink-900 dark:text-white mb-1">
              {profile?.username}
            </h2>
            <p className="text-ink-700 dark:text-gray-200 text-sm mb-2">
              Miembro desde {memberSince}
            </p>
            {profile?.bio && (
              <p className="text-sm text-ink-700 dark:text-gray-200 italic bg-white/60 px-4 py-2 rounded-xl max-w-xl">
                "{profile.bio}"
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <TrialBadge />
            <Link to="/profile">
              <Button variant="secondary" size="sm">
                Editar perfil
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <GardenWidget />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="text-center shadow-card">
          <div className="mb-2 flex justify-center text-primary-500">
            <JournalIcon size={24} color="currentColor" />
          </div>
          <div className="text-3xl font-bold text-primary-500 mb-1">
            {stats?.total_entries || 0}
          </div>
          <div className="text-sm text-ink-700 dark:text-gray-200 font-medium">Entradas totales</div>
        </Card>

        <Card hover className="text-center shadow-card">
          <div className="mb-2 flex justify-center text-sky-500">
            <CalmIcon size={24} color="currentColor" />
          </div>
          <div className="text-3xl font-bold text-sky-500 mb-1">
            {stats?.entries_this_week || 0}
          </div>
          <div className="text-sm text-ink-700 dark:text-gray-200 font-medium">Esta semana</div>
        </Card>

        <Card hover className="text-center shadow-card">
          <div className="mb-2 flex justify-center text-pink-400">
            <HeartIcon size={24} color="currentColor" />
          </div>
          <div className="text-3xl font-bold text-pink-400 mb-1">
            {stats?.entries_this_month || 0}
          </div>
          <div className="text-sm text-ink-700 dark:text-gray-200 font-medium">Este mes</div>
        </Card>

        <Card hover className="text-center shadow-card">
          <div className="mb-2 flex justify-center text-amber-400">
            <SparkleIcon size={24} color="currentColor" />
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">
            {stats?.streak_days || 0}
          </div>
          <div className="text-sm text-ink-700 dark:text-gray-200 font-medium">Racha</div>
          <p className="text-xs text-ink-500 dark:text-gray-400 mt-2">
            {streakMessage}
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-white">
            Que te gustaria hacer hoy?
          </h2>
          <p className="text-sm text-ink-600 dark:text-gray-300">
            Elige una accion suave para ti.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EmotionalCard
            title="Nueva entrada"
            description="Escribe sobre como te sientes hoy. Tu voz importa."
            icon={<JournalIcon size={32} />}
            color="#A78BFA"
            href="/diary"
          />

          <EmotionalCard
            title="Ver mi diario"
            description="Revisa tus entradas anteriores y observa tu progreso."
            icon={<JournalIcon size={32} />}
            color="#7DD3FC"
            href="/diary"
          />

          <EmotionalCard
            title="Ejercicios de calma"
            description="Tecnicas para encontrar paz cuando mas lo necesitas."
            icon={<CalmIcon size={32} />}
            color="#BBF7D0"
            href="/calm"
          />

          <EmotionalCard
            title="Lineas de ayuda"
            description="Acceso inmediato a recursos de apoyo profesional."
            icon={<HeartIcon size={32} />}
            color="#FBCFE8"
            href="/sos"
          />

          <EmotionalCard
            title="Mis estadisticas"
            description="Visualiza patrones y celebra tus logros."
            icon={<SparkleIcon size={32} />}
            color="#C4B5FD"
            href="/statistics"
          />

          <EmotionalCard
            title="Configuracion"
            description="Personaliza tu experiencia segun tus necesidades."
            icon={<SparkleIcon size={28} color="currentColor" />}
            color="#FED7AA"
            href="/settings"
          />
        </div>
      </section>

      {stats?.last_entry_date && (
        <Card className="shadow-card">
          <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-primary-500">
              <JournalIcon size={20} color="currentColor" />
            </span>
            <span>Actividad reciente</span>
          </h3>
          <div className="bg-gradient-to-r from-purple-100/50 to-violet-100/50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-5">
            <p className="text-ink-900 dark:text-white font-medium">
              <strong className="text-primary-500">Ultima entrada:</strong>{' '}
              {new Date(stats.last_entry_date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {stats.average_mood && (
              <p className="text-ink-900 dark:text-white font-medium mt-2">
                <strong className="text-primary-500">Estado promedio:</strong> {stats.average_mood}
              </p>
            )}
          </div>
        </Card>
      )}

      <Card className="shadow-card">
        <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-rose-500">
            <HeartIcon size={20} color="currentColor" />
          </span>
          <span>Recuerda</span>
        </h3>
        <p className="text-ink-900 dark:text-white leading-relaxed bg-gradient-to-r from-emerald-100/50 to-cyan-100/50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl p-5">
          Escribir en tu diario es una forma poderosa de conectar contigo. No importa si escribes mucho o poco, lo importante es que estes aqui, dandote este espacio. Cada palabra cuenta.
        </p>
      </Card>
    </div>
  )
}
