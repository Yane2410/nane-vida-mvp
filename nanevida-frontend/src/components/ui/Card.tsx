import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export default function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''
  const gradientStyles = gradient 
    ? 'bg-gradient-to-br from-purple-50 via-white to-emerald-50' 
    : 'bg-white'
  
  return (
    <div 
      className={`rounded-2xl border border-purple-100 p-6 shadow-lg transition-all duration-300 ${gradientStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  )
}
