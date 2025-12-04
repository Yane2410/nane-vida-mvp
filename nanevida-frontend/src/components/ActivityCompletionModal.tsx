import { useNavigate } from 'react-router-dom'
import Card from './ui/Card'
import Button from './ui/Button'

interface ActivityCompletionModalProps {
  isOpen: boolean
  activityName: string
  activityIcon: string
  plantName?: string
  onClose: () => void
}

export default function ActivityCompletionModal({ 
  isOpen, 
  activityName, 
  activityIcon, 
  plantName,
  onClose 
}: ActivityCompletionModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGoToGarden = () => {
    onClose()
    navigate('/garden')
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="text-center p-6 sm:p-8 animate-scaleIn bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-500/30">
            {/* Success Icon */}
            <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
              {activityIcon}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              ¡Actividad Completada! 🎉
            </h2>

            {/* Activity Info */}
            <p className="text-base sm:text-lg text-black dark:text-white mb-4">
              Has completado: <span className="font-semibold text-purple-600 dark:text-purple-400">{activityName}</span>
            </p>

            {/* Plant Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-6 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🌱</span>
                <p className="text-sm sm:text-base font-semibold text-green-800 dark:text-green-200">
                  Semilla Plantada
                </p>
              </div>
              {plantName && (
                <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">
                  {plantName}
                </p>
              )}
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">
                Tu jardín está creciendo 🌸
              </p>
            </div>

            {/* Gentle Message */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 border border-purple-200 dark:border-purple-700">
              <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-200 italic leading-relaxed">
                "Cada momento que dedicas a tu bienestar es una inversión en ti. 
                Sigue nutriendo tu jardín interior." 💜
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoToGarden}
                className="flex-1"
              >
                🌳 Ver mi Jardín
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onClose}
                className="flex-1"
              >
                ✨ Continuar
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
