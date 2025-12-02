import { SparkleIcon } from '../../assets/icons'

interface AppHeaderProps {
  greeting?: string
  subtitle?: string
  showIcon?: boolean
  className?: string
}

export default function AppHeader({
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/10 via-[#7DD3FC]/5 to-transparent rounded-3xl" />
      
      {/* Content */}
      <div className="relative p-8 sm:p-10 text-center">
        {showIcon && (
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-[#A78BFA]/20 to-[#C4B5FD]/20 animate-pulse">
            <SparkleIcon size={32} color="#A78BFA" />
          </div>
        )}
        
        <h1 className="text-3xl sm:text-4xl font-bold text-[#333333] mb-3">
          {getGreeting()}
        </h1>
        
        <p className="text-base sm:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
          {getSubtitle()}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-[#FBCFE8]/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#BBF7D0]/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  )
}
