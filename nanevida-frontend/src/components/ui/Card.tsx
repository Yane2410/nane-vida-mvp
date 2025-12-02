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
    ? 'hover:shadow-xl hover:-translate-y-2 hover:scale-[1.01] cursor-pointer hover:border-purple-200'
    : ''
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-purple-50/50 via-white to-emerald-50/50 backdrop-blur-sm'
    : 'bg-white/95 backdrop-blur-sm'
  const animationStyles = animated ? 'animate-scaleIn' : ''

  return (
    <div
      className={`
        rounded-2xl border border-purple-100/60 p-6 shadow-lg
        transition-all duration-300 ease-out
        ${gradientStyles} ${hoverStyles} ${animationStyles}
        ${className}
      `}
      style={{
        boxShadow: '0 6px 18px rgba(139, 92, 246, 0.06)',
      }}
    >
      {children}
    </div>
  )
}
