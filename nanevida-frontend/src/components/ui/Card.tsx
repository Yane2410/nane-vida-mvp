import { ReactNode, CSSProperties, memo } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  animated?: boolean
  style?: CSSProperties
}

const Card = memo(function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  animated = true,
  style
}: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-strong hover:-translate-y-1 cursor-pointer motion-reduce:transform-none'
    : ''

  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-card via-surface-2 to-primary-100/30 dark:from-surface-2 dark:via-surface-3 dark:to-gray-900/60'
    : 'glass'

  const animationStyles = animated ? 'animate-scaleIn' : ''

  return (
    <div
      className={`rounded-ds-lg border border-border p-6 sm:p-8 shadow-soft transition-all duration-[var(--transition-base)] ease-[var(--easing)] ${gradientStyles} ${hoverStyles} ${animationStyles} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
})

export default Card
