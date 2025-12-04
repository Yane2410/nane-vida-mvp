import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  id: string
  message: string
  type: ToastType
  duration?: number
  onClose: (id: string) => void
}

const toastStyles = {
  success: {
    bg: 'bg-gradient-to-r from-energy to-energy-light',
    icon: '✓',
    ring: 'ring-energy/20',
    text: 'text-black'
  },
  error: {
    bg: 'bg-gradient-to-r from-red-400 to-red-300',
    icon: '✗',
    ring: 'ring-red-400/20',
    text: 'text-black'
  },
  info: {
    bg: 'bg-gradient-to-r from-calm to-calm-light',
    icon: 'ℹ',
    ring: 'ring-calm/20',
    text: 'text-black'
  },
  warning: {
    bg: 'bg-gradient-to-r from-warmth to-warmth-light',
    icon: '⚠',
    ring: 'ring-warmth/20',
    text: 'text-black'
  }
}

export default function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  const style = toastStyles[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div
      className={`
        ${style.bg} ${style.ring} ${style.text}
        flex items-center gap-3 px-4 py-3 rounded-2xl
        shadow-medium ring-4
        animate-slideUp
        backdrop-blur-sm
        min-w-[280px] max-w-md
      `}
    >
      {/* Icon */}
      <span className="text-2xl flex-shrink-0 animate-successPulse">
        {style.icon}
      </span>

      {/* Message */}
      <p className="font-medium text-sm flex-1">
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
        aria-label="Cerrar notificación"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M9 3L3 9M3 3L9 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}
