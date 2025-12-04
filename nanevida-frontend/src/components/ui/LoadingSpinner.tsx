import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const LoadingSpinner = memo(function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fadeIn">
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizes[size]} border-purple-200 border-t-purple-600 rounded-full animate-spin`}
          style={{ animationDuration: '0.8s' }}
          role="status"
          aria-label="Cargando"
        />
        {/* Inner pulsing dot */}
        <div
          className="absolute inset-0 m-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"
        />
      </div>
      {text && (
        <p className="mt-4 text-sm text-purple-600 font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
})

export default LoadingSpinner
