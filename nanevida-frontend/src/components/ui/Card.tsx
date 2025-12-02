import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  animated?: boolean
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  animated = true
}: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-200/60 cursor-pointer'
    : ''
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-white/90 via-indigo-50/30 to-purple-50/40'
    : 'bg-white/85'
  const animationStyles = animated ? 'animate-scaleIn' : ''

  return (
    <div
      className={`
        rounded-2xl border border-white/40 p-6
        backdrop-blur-xl
        shadow-xl
        transition-all duration-300 ease-out
        ${gradientStyles} ${hoverStyles} ${animationStyles}
        ${className}
      `}
      style={{
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.18) inset',
      }}
    >
      {children}
    </div>
  )
}

