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
    bg: 'bg-success',
    icon: 'OK',
    ring: 'ring-success/20',
    text: 'text-success-foreground'
  },
  error: {
    bg: 'bg-error',
    icon: '!',
    ring: 'ring-error/20',
    text: 'text-error-foreground'
  },
  info: {
    bg: 'bg-info',
    icon: 'i',
    ring: 'ring-info/20',
    text: 'text-info-foreground'
  },
  warning: {
    bg: 'bg-warning',
    icon: '!',
    ring: 'ring-warning/20',
    text: 'text-warning-foreground'
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
        flex items-center gap-3 px-4 py-3 rounded-ds-md
        shadow-medium ring-4
        animate-slideUp motion-reduce:animate-none
        backdrop-blur-sm
        min-w-[280px] max-w-md
      `}
    >
      <span className="text-xs font-bold px-2 py-1 rounded-ds-sm bg-white/40">
        {style.icon}
      </span>

      <p className="font-medium text-sm flex-1">
        {message}
      </p>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-white/20 transition-colors duration-[var(--transition-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label="Cerrar notificacion"
        title="Cerrar"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
