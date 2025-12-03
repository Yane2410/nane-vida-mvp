import { useEffect, useState } from 'react'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Link, useNavigate } from 'react-router-dom'
import { useOnboarding } from '../contexts/OnboardingContext'
import ReminderSettings from '../components/ui/ReminderSettings'

type Profile = {
  username: string
  email: string
  first_name: string
  last_name: string
  bio?: string
  avatar?: string
}

type NotificationSettings = {
  email_notifications: boolean
  daily_reminder: boolean
  weekly_summary: boolean
  achievement_alerts: boolean
}

type PrivacySettings = {
  profile_visibility: 'public' | 'private' | 'friends'
  allow_analytics: boolean
  data_sharing: boolean
}

export default function Settings() {
  const { startOnboarding } = useOnboarding()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    daily_reminder: true,
    weekly_summary: false,
    achievement_alerts: true,
  })
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profile_visibility: 'private',
    allow_analytics: true,
    data_sharing: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const { data } = await api.get('/profile/')
      setProfile(data)
    } catch (e: any) {
      console.error('Error loading settings:', e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.put('/profile/', profile)
      setMessage('✅ Perfil actualizado correctamente')
    } catch (e: any) {
      setMessage('❌ Error al actualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveNotifications() {
    setSaving(true)
    setMessage('')
    try {
      // TODO: Implement backend endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage('✅ Notificaciones actualizadas')
    } catch (e: any) {
      setMessage('❌ Error al actualizar notificaciones')
    } finally {
      setSaving(false)
    }
  }

  async function handleSavePrivacy() {
    setSaving(true)
    setMessage('')
    try {
      // TODO: Implement backend endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      setMessage('✅ Configuración de privacidad actualizada')
    } catch (e: any) {
      setMessage('❌ Error al actualizar privacidad')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage('❌ Las contraseñas no coinciden')
      return
    }
    if (passwordData.new_password.length < 8) {
      setMessage('❌ La contraseña debe tener al menos 8 caracteres')
      return
    }
    setSaving(true)
    setMessage('')
    try {
      await api.post('/auth/change-password/', {
        old_password: passwordData.current_password,
        new_password: passwordData.new_password,
      })
      setMessage('✅ Contraseña actualizada correctamente')
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (e: any) {
      setMessage('❌ Error al cambiar contraseña')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    const confirmation = window.confirm(
      '⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?\n\nEsta acción es IRREVERSIBLE y eliminará:\n- Todas tus entradas de diario\n- Tu perfil y configuración\n- Tus estadísticas\n\nEscribe "ELIMINAR" para confirmar'
    )
    if (!confirmation) return

    const typed = window.prompt('Escribe "ELIMINAR" para confirmar:')
    if (typed !== 'ELIMINAR') {
      setMessage('❌ Eliminación cancelada')
      return
    }

    setSaving(true)
    try {
      await api.delete('/profile/')
      alert('Tu cuenta ha sido eliminada. Serás redirigido al inicio.')
      localStorage.removeItem('token')
      navigate('/login')
    } catch (e: any) {
      setMessage('❌ Error al eliminar cuenta')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Cargando configuración..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card gradient className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span>⚙️</span>
          Configuración
        </h1>
        <p className="text-gray-600">
          Administra tu perfil, notificaciones y privacidad
        </p>
      </Card>

      {/* Message */}
      {message && (
        <Card className={`text-center ${message.includes('✅') ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className="font-medium">{message}</p>
        </Card>
      )}

      {/* Reminders Section */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>⏰</span>
          Recordatorios
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Configura recordatorios para no olvidar tus ejercicios de bienestar emocional.
        </p>
        <ReminderSettings />
      </Card>

      {/* Profile Settings */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>👤</span>
          Información del Perfil
        </h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={profile?.username || ''}
                onChange={(e) => setProfile({ ...profile!, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => setProfile({ ...profile!, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={profile?.first_name || ''}
                onChange={(e) => setProfile({ ...profile!, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={profile?.last_name || ''}
                onChange={(e) => setProfile({ ...profile!, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              value={profile?.bio || ''}
              onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Cuéntanos un poco sobre ti..."
            />
          </div>
          <Button type="submit" variant="primary" isLoading={saving} fullWidth>
            💾 Guardar Perfil
          </Button>
        </form>
      </Card>

      {/* Change Password */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔒</span>
          Cambiar Contraseña
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              minLength={8}
            />
          </div>
          <Button type="submit" variant="secondary" isLoading={saving} fullWidth>
            🔑 Cambiar Contraseña
          </Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔔</span>
          Notificaciones
        </h2>
        <div className="space-y-4">
          {[
            { key: 'email_notifications', label: 'Notificaciones por email', icon: '📧' },
            { key: 'daily_reminder', label: 'Recordatorio diario', icon: '⏰' },
            { key: 'weekly_summary', label: 'Resumen semanal', icon: '📊' },
            { key: 'achievement_alerts', label: 'Alertas de logros', icon: '🏆' },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="flex items-center gap-2 text-gray-700">
                <span>{icon}</span>
                {label}
              </span>
              <input
                type="checkbox"
                checked={notifications[key as keyof NotificationSettings] as boolean}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>
          ))}
          <Button onClick={handleSaveNotifications} variant="primary" isLoading={saving} fullWidth>
            💾 Guardar Notificaciones
          </Button>
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>🔐</span>
          Privacidad y Seguridad
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🌐 Visibilidad del perfil
            </label>
            <select
              value={privacy.profile_visibility}
              onChange={(e) => setPrivacy({ ...privacy, profile_visibility: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="public">Público - Visible para todos</option>
              <option value="friends">Amigos - Solo amigos pueden ver</option>
              <option value="private">Privado - Solo yo puedo ver</option>
            </select>
          </div>
          {[
            { key: 'allow_analytics', label: 'Permitir análisis de uso', icon: '📈' },
            { key: 'data_sharing', label: 'Compartir datos anónimos', icon: '🔄' },
          ].map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="flex items-center gap-2 text-gray-700">
                <span>{icon}</span>
                {label}
              </span>
              <input
                type="checkbox"
                checked={privacy[key as keyof PrivacySettings] as boolean}
                onChange={(e) => setPrivacy({ ...privacy, [key]: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>
          ))}
          <Button onClick={handleSavePrivacy} variant="primary" isLoading={saving} fullWidth>
            💾 Guardar Privacidad
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200 bg-red-50">
        <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <span>⚠️</span>
          Zona Peligrosa
        </h2>
        <p className="text-gray-700 mb-4">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, estate seguro.
        </p>
        <Button 
          onClick={handleDeleteAccount} 
          variant="ghost" 
          className="border-2 border-red-500 text-red-700 hover:bg-red-100"
          isLoading={saving}
          fullWidth
        >
          🗑️ Eliminar Cuenta Permanentemente
        </Button>
      </Card>

      {/* Onboarding */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>🎓</span>
          Tutorial de Bienvenida
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          ¿Necesitas un recordatorio de cómo funciona la app? Vuelve a ver el tutorial de introducción.
        </p>
        <Button 
          onClick={startOnboarding} 
          variant="secondary"
          icon={<span>🌸</span>}
          fullWidth
        >
          Ver Tutorial de Nuevo
        </Button>
      </Card>

      {/* Navigation */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="secondary" icon={<span>📊</span>}>
              Volver al Dashboard
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="primary" icon={<span>👤</span>}>
              Ver Perfil
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
