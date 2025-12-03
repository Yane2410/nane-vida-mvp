import { memo } from 'react'
import { SparkleIcon } from '../../assets/icons'

interface AppHeaderProps {
  greeting?: string
  subtitle?: string
  showIcon?: boolean
  className?: string
}

const AppHeader = memo(function AppHeader({
  greeting,
  subtitle,
  showIcon = true,
  className = '',
}: AppHeaderProps) {
  // Saludo contextual según la hora
  const getGreeting = () => {
    if (greeting) return greeting
    
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getSubtitle = () => {
    if (subtitle) return subtitle
    
    const hour = new Date().getHours()
    if (hour < 12) return 'Es un buen momento para cuidar de ti'
    if (hour < 18) return 'Recuerda tomarte un momento para ti'
    return 'Es momento de descansar y reflexionar'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 via-calm/5 to-transparent rounded-3xl" />
      
      {/* Content */}
      <div className="relative p-8 sm:p-10 text-center">
        {showIcon && (
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-primary-400/20 to-primary-300/20 animate-pulse">
            <SparkleIcon size={32} color="#8B5CF6" />
          </div>
        )}
        
        <h1 className="text-h1 text-gray-900 mb-3">
          {getGreeting()}
        </h1>
        
        <p className="text-body-lg text-gray-700 max-w-2xl mx-auto">
          {getSubtitle()}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gentle/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-energy/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
})

export default AppHeader
