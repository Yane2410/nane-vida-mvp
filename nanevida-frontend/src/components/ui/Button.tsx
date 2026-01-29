import { ButtonHTMLAttributes, ReactNode, memo } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  children?: ReactNode
}

const Button = memo(function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  icon,
  leftIcon,
  rightIcon,
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = [
    'group inline-flex items-center justify-center gap-2.5 font-semibold rounded-ds-md',
    'transition-[transform,box-shadow,background,color,border] duration-[var(--transition-base)] ease-[var(--easing)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:transform-none',
    'relative overflow-hidden shadow-soft motion-reduce:transition-none motion-reduce:transform-none'
  ].join(' ')

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:shadow-medium active:scale-[0.98]',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-muted',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
    danger: 'bg-destructive text-destructive-foreground hover:shadow-medium active:scale-[0.98]',
    success: 'bg-success text-success-foreground hover:shadow-medium active:scale-[0.98]',
    outline: 'border border-border text-foreground bg-transparent hover:bg-muted',
    gradient: 'bg-gradient-primary text-white shadow-glow hover:shadow-strong active:scale-[0.98]'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]'
  }

  const iconSizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-11 w-11 text-base',
    lg: 'h-12 w-12 text-lg'
  }

  const widthClass = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || isLoading
  const effectiveLeftIcon = leftIcon ?? icon
  const isIconOnly = !children && (effectiveLeftIcon || rightIcon)
  const sizeClass = isIconOnly ? iconSizes[size] : sizes[size]

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${widthClass} ${className}`}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && (
        <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}

      {!isLoading && effectiveLeftIcon && (
        <span className="flex-shrink-0 text-xl">{effectiveLeftIcon}</span>
      )}

      {children && <span className={isLoading ? 'opacity-70' : ''}>{children}</span>}

      {!isLoading && rightIcon && (
        <span className="flex-shrink-0 text-xl">{rightIcon}</span>
      )}
    </button>
  )
})

export default Button
