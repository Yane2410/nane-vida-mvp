import { useState } from 'react'
import { useReminders, Reminder } from '../../contexts/ReminderContext'
import Card from './Card'
import Button from './Button'

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const REMINDER_TYPES = [
  { value: 'breath', label: 'Respiración', icon: '🌬️', color: '#A78BFA' },
  { value: 'reflection', label: 'Reflexión', icon: '🌺', color: '#EC4899' },
  { value: 'diary', label: 'Diario', icon: '📔', color: '#F59E0B' },
  { value: 'general', label: 'General', icon: '💜', color: '#8B5CF6' },
] as const

export default function ReminderSettings() {
  const {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    notificationPermission,
    requestNotificationPermission,
  } = useReminders()

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Reminder, 'id'>>({
    type: 'general',
    title: '',
    message: '',
    time: '09:00',
    days: [1, 2, 3, 4, 5],
    enabled: true,
  })

  const handleSave = () => {
    if (editingId) {
      updateReminder(editingId, formData)
      setEditingId(null)
    } else {
      addReminder(formData)
      setIsAdding(false)
    }
    // Reset form
    setFormData({
      type: 'general',
      title: '',
      message: '',
      time: '09:00',
      days: [1, 2, 3, 4, 5],
      enabled: true,
    })
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setFormData({
      type: reminder.type,
      title: reminder.title,
      message: reminder.message,
      time: reminder.time,
      days: reminder.days,
      enabled: reminder.enabled,
    })
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      type: 'general',
      title: '',
      message: '',
      time: '09:00',
      days: [1, 2, 3, 4, 5],
      enabled: true,
    })
  }

  const toggleDay = (day: number) => {
    if (formData.days.includes(day)) {
      setFormData({ ...formData, days: formData.days.filter(d => d !== day) })
    } else {
      setFormData({ ...formData, days: [...formData.days, day].sort() })
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Permission */}
      {notificationPermission !== 'granted' && (
        <Card className="bg-warmth/20 dark:bg-warmth-dark/20 border-warmth/40 dark:border-warmth/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔔</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Activa las notificaciones
              </h3>
              <p className="text-sm text-gray-900 dark:text-gray-100 mb-4">
                Para recibir recordatorios, necesitamos tu permiso para enviarte notificaciones.
              </p>
              <Button
                onClick={requestNotificationPermission}
                variant="primary"
                size="sm"
                disabled={notificationPermission === 'denied'}
              >
                {notificationPermission === 'denied' 
                  ? '❌ Notificaciones bloqueadas' 
                  : '✨ Activar notificaciones'}
              </Button>
              {notificationPermission === 'denied' && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Las notificaciones están bloqueadas. Actívalas en la configuración de tu navegador.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.map(reminder => {
          const reminderType = REMINDER_TYPES.find(t => t.value === reminder.type)
          return (
            <Card key={reminder.id} hover className="group">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-soft"
                  style={{ backgroundColor: `${reminderType?.color}20` }}
                >
                  {reminderType?.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {reminder.title}
                      </h3>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {reminder.message}
                      </p>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors duration-300
                        ${reminder.enabled 
                          ? 'bg-primary-400 dark:bg-primary-500' 
                          : 'bg-gray-300 dark:bg-gray-600'}
                      `}
                    >
                      <div className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-soft
                        transition-transform duration-300
                        ${reminder.enabled ? 'translate-x-6' : 'translate-x-0'}
                      `} />
                    </button>
                  </div>

                  {/* Time and Days */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium">
                      🕐 {reminder.time}
                    </span>
                    <div className="flex gap-1">
                      {reminder.days.map(day => (
                        <span
                          key={day}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-xs font-medium"
                        >
                          {DAYS[day]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-2 border-primary-400/40 dark:border-primary-500/40">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {editingId ? '✏️ Editar recordatorio' : '➕ Nuevo recordatorio'}
          </h3>

          <div className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de recordatorio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {REMINDER_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`
                      p-3 rounded-xl border-2 transition-all text-center
                      ${formData.type === type.value
                        ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                    `}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-400 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-400/20 dark:focus:ring-primary-500/30 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Ej: Momento de respirar 🌬️"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensaje
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-400 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-400/20 dark:focus:ring-primary-500/30 outline-none transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Ej: Tómate 5 minutos para un ejercicio de respiración consciente."
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hora
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-400 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-400/20 dark:focus:ring-primary-500/30 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Días de la semana
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(index)}
                    className={`
                      px-4 py-2 rounded-xl font-medium transition-all
                      ${formData.days.includes(index)
                        ? 'bg-primary-400 dark:bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} variant="primary" fullWidth>
                {editingId ? '💾 Guardar cambios' : '➕ Crear recordatorio'}
              </Button>
              <Button onClick={handleCancel} variant="secondary" fullWidth>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          variant="primary"
          size="lg"
          fullWidth
          icon={<span>➕</span>}
        >
          Agregar nuevo recordatorio
        </Button>
      )}
    </div>
  )
}
