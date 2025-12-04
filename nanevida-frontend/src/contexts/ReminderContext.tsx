import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Reminder {
  id: string
  type: 'breath' | 'reflection' | 'diary' | 'general'
  title: string
  message: string
  time: string // Format: "HH:MM"
  days: number[] // 0-6 (Sunday-Saturday)
  enabled: boolean
}

interface ReminderContextType {
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  updateReminder: (id: string, reminder: Partial<Reminder>) => void
  deleteReminder: (id: string) => void
  toggleReminder: (id: string) => void
  notificationPermission: NotificationPermission
  requestNotificationPermission: () => Promise<void>
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined)

const REMINDERS_KEY = 'nanevida_reminders'
const DEFAULT_REMINDERS: Reminder[] = [
  {
    id: 'morning-breath',
    type: 'breath',
    title: 'Momento de respirar 🌬️',
    message: 'Buenos días! Tómate 5 minutos para un ejercicio de respiración consciente.',
    time: '09:00',
    days: [1, 2, 3, 4, 5], // Weekdays
    enabled: false
  },
  {
    id: 'afternoon-reflection',
    type: 'reflection',
    title: 'Pausa para reflexionar 🌺',
    message: 'Es hora de conectar contigo. ¿Qué tal una reflexión guiada?',
    time: '15:00',
    days: [1, 2, 3, 4, 5],
    enabled: false
  },
  {
    id: 'evening-diary',
    type: 'diary',
    title: 'Diario nocturno 📔',
    message: 'Antes de dormir, ¿qué tal escribir sobre tu día?',
    time: '21:00',
    days: [0, 1, 2, 3, 4, 5, 6], // All days
    enabled: false
  }
]

export function ReminderProvider({ children }: { children: ReactNode }) {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(REMINDERS_KEY)
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS
  })
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  )

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders))
  }, [reminders])

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const currentDay = now.getDay()

      reminders.forEach(reminder => {
        if (
          reminder.enabled &&
          reminder.time === currentTime &&
          reminder.days.includes(currentDay) &&
          notificationPermission === 'granted'
        ) {
          showNotification(reminder)
        }
      })
    }

    // Check immediately
    checkReminders()

    // Then check every minute
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [reminders, notificationPermission])

  const showNotification = (reminder: Reminder) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return
    }

    const iconMap = {
      breath: '🌬️',
      reflection: '🌺',
      diary: '📔',
      general: '💜'
    }

    new Notification(reminder.title, {
      body: reminder.message,
      icon: '/vite.svg', // You can change this to a custom icon
      badge: '/vite.svg',
      tag: reminder.id,
      requireInteraction: false,
      silent: false,
      data: {
        url: `/${reminder.type}`,
        icon: iconMap[reminder.type]
      }
    })
  }

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications not supported')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('¡Notificaciones activadas! 🎉', {
          body: 'Ahora recibirás recordatorios para cuidar tu bienestar emocional.',
          icon: '/vite.svg'
        })
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder-${Date.now()}`
    }
    setReminders([...reminders, newReminder])
  }

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ))
  }

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id))
  }

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminder,
        notificationPermission,
        requestNotificationPermission,
      }}
    >
      {children}
    </ReminderContext.Provider>
  )
}

export function useReminders() {
  const context = useContext(ReminderContext)
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider')
  }
  return context
}
