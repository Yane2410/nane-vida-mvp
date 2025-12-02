import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  isLoading?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  icon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-emerald-400 text-white hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02] focus:ring-purple-400 active:scale-100 active:translate-y-0',
    secondary: 'bg-white text-purple-900 border border-purple-100 hover:bg-purple-50 hover:shadow-md hover:-translate-y-0.5 focus:ring-purple-300 active:translate-y-0',
    ghost: 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-100 hover:shadow-sm focus:ring-amber-300',
    danger: 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border border-red-200 hover:bg-red-100 hover:shadow-sm focus:ring-red-300',
    success: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:shadow-sm focus:ring-emerald-300'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || isLoading
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Ripple effect background */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-300 bg-white" />
      </span>
      
      {/* Loading spinner */}
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Icon */}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      
      {/* Content */}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </button>
  )
}
