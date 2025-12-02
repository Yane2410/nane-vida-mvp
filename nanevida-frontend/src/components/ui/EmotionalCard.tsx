import { ReactNode } from 'react'
import Card from './Card'

interface EmotionalCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  onClick?: () => void
  href?: string
  className?: string
}

export default function EmotionalCard({
  title,
  description,
  icon,
  color,
  onClick,
  href,
  className = '',
}: EmotionalCardProps) {
  const content = (
    <Card
      hover
      className={`group relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, white 100%)`,
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: color }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon container */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
          style={{
            backgroundColor: `${color}20`,
            boxShadow: `0 4px 12px ${color}30`,
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#333333] mb-2 group-hover:text-[#555555] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#555555] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ color }}
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Card>
  )

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    )
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    )
  }

  return content
}
