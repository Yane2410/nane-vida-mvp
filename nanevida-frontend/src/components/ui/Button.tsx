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
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden shadow-md hover:shadow-lg'
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-indigo-500/50 focus:ring-indigo-400 active:scale-[0.98] bg-[length:200%_100%] hover:bg-[position:100%_0]',
    secondary: 'bg-white/90 backdrop-blur-sm text-slate-700 border border-white/60 hover:bg-white hover:-translate-y-0.5 hover:shadow-slate-200/80 focus:ring-indigo-300 active:scale-[0.98]',
    ghost: 'bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-white hover:-translate-y-0.5 hover:shadow-amber-500/50 focus:ring-amber-300 active:scale-[0.98]',
    danger: 'bg-gradient-to-br from-rose-500 to-red-600 text-white hover:-translate-y-0.5 hover:shadow-rose-500/50 focus:ring-rose-300 active:scale-[0.98]',
    success: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:-translate-y-0.5 hover:shadow-emerald-500/50 focus:ring-emerald-300 active:scale-[0.98]'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || isLoading
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      </span>
      
      {/* Loading spinner */}
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 flex-shrink-0"
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
      {!isLoading && icon && <span className="flex-shrink-0 text-lg">{icon}</span>}
      
      {/* Content */}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </button>
  )
}
