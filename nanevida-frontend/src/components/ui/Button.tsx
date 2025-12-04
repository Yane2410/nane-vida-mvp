import { ButtonHTMLAttributes, ReactNode, memo } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  isLoading?: boolean
  children: ReactNode
}

const Button = memo(function Button({
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
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden shadow-soft hover:shadow-medium interactive'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-400 to-primary-300 dark:from-primary-500 dark:to-primary-400 text-white hover:shadow-primary-300/50 dark:hover:shadow-primary-400/50 focus:ring-primary-200 dark:focus:ring-primary-700 active:scale-[0.98] border-2 border-white/20 dark:border-white/10',
    secondary: 'glass text-black dark:text-gray-100 border-2 border-primary-400/20 dark:border-primary-500/30 hover:border-primary-400/40 dark:hover:border-primary-500/50 focus:ring-primary-100 dark:focus:ring-primary-800 active:scale-[0.98]',
    ghost: 'bg-gradient-to-br from-warmth to-warmth-light dark:from-warmth-dark dark:to-warmth text-black dark:text-gray-100 hover:shadow-warmth/50 dark:hover:shadow-warmth/40 focus:ring-warmth/20 dark:focus:ring-warmth/30 active:scale-[0.98] border-2 border-white/20 dark:border-white/10',
    danger: 'bg-gradient-to-br from-red-300 to-red-200 dark:from-red-500 dark:to-red-400 text-black dark:text-white hover:shadow-red-300/50 dark:hover:shadow-red-400/50 focus:ring-red-200 dark:focus:ring-red-700 active:scale-[0.98] border-2 border-white/20 dark:border-white/10',
    success: 'bg-gradient-to-br from-energy to-energy-light dark:from-energy-dark dark:to-energy text-black dark:text-gray-100 hover:shadow-energy/50 dark:hover:shadow-energy/40 focus:ring-energy/20 dark:focus:ring-energy/30 active:scale-[0.98] border-2 border-white/20 dark:border-white/10'
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
})

export default Button
