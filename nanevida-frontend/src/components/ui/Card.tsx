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
    ? 'hover:shadow-strong hover:-translate-y-1 hover:border-primary-400/40 dark:hover:border-primary-500/50 cursor-pointer'
    : ''
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-white/95 via-primary-50/50 to-primary-100/30 dark:from-gray-800/95 dark:via-gray-800/80 dark:to-gray-900/70'
    : 'glass'
  const animationStyles = animated ? 'animate-scale-in' : ''

  return (
    <div
      className={`
        rounded-3xl border-2 border-primary-400/20 dark:border-primary-500/30 p-6 sm:p-8
        backdrop-blur-xl
        shadow-soft
        transition-all duration-300 ease-out
        ${gradientStyles} ${hoverStyles} ${animationStyles}
        ${className}
      `}
      style={{
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        ...style,
      }}
    >
      {children}
    </div>
  )
})

export default Card
