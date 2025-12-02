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
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden shadow-md hover:shadow-xl'
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#A78BFA] to-[#C4B5FD] text-white hover:-translate-y-1 hover:shadow-purple-300/50 focus:ring-purple-200 active:scale-[0.98] border-2 border-white/20',
    secondary: 'bg-white/95 backdrop-blur-sm text-[#333333] border-2 border-[#A78BFA]/20 hover:bg-white hover:-translate-y-1 hover:shadow-purple-200/60 hover:border-[#A78BFA]/40 focus:ring-purple-100 active:scale-[0.98]',
    ghost: 'bg-gradient-to-br from-[#FED7AA] to-[#FDBA74] text-[#333333] hover:-translate-y-1 hover:shadow-orange-300/50 focus:ring-orange-200 active:scale-[0.98] border-2 border-white/20',
    danger: 'bg-gradient-to-br from-[#FECACA] to-[#FCA5A5] text-[#333333] hover:-translate-y-1 hover:shadow-rose-300/50 focus:ring-rose-200 active:scale-[0.98] border-2 border-white/20',
    success: 'bg-gradient-to-br from-[#BBF7D0] to-[#86EFAC] text-[#333333] hover:-translate-y-1 hover:shadow-emerald-300/50 focus:ring-emerald-200 active:scale-[0.98] border-2 border-white/20'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || isLoading
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Subtle shine effect on hover */}
      <span className="absolute inset-0 overflow-hidden rounded-2xl">
        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
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
      {!isLoading && icon && <span className="flex-shrink-0 text-xl">{icon}</span>}
      
      {/* Content */}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>
    </button>
  )
}
