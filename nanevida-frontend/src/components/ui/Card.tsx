import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  animated?: boolean
  style?: CSSProperties
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  animated = true,
  style
}: CardProps) {
  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-[#A78BFA]/40 cursor-pointer'
    : ''
  const gradientStyles = gradient
    ? 'bg-gradient-to-br from-white/95 via-[#F7F5FF]/50 to-[#E0D9FF]/30'
    : 'bg-white/90'
  const animationStyles = animated ? 'animate-scaleIn' : ''

  return (
    <div
      className={`
        rounded-3xl border-2 border-[#A78BFA]/20 p-6 sm:p-8
        backdrop-blur-xl
        shadow-lg
        transition-all duration-300 ease-out
        ${gradientStyles} ${hoverStyles} ${animationStyles}
        ${className}
      `}
      style={{
        boxShadow: '0 8px 32px rgba(167, 139, 250, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

