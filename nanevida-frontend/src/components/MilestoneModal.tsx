import { useEffect, useState } from 'react'
import { useGarden, Milestone } from '../contexts/GardenContext'
import Card from './ui/Card'
import Button from './ui/Button'

export default function MilestoneModal() {
  const { garden, markMilestoneViewed } = useGarden()
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (garden && garden.unviewed_milestones.length > 0) {
      // Show the first unviewed milestone
      setCurrentMilestone(garden.unviewed_milestones[0])
      setShowConfetti(true)
      
      // Stop confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }, [garden?.unviewed_milestones])

  if (!currentMilestone) return null

  const handleClose = async () => {
    if (currentMilestone) {
      await markMilestoneViewed(currentMilestone.id)
      setCurrentMilestone(null)
      setShowConfetti(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="relative max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="text-center p-8 animate-scaleIn">
            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10%',
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${2 + Math.random()}s`
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: ['#A78BFA', '#FBCFE8', '#FEF3C7', '#BBF7D0', '#7DD3FC'][Math.floor(Math.random() * 5)]
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Icon */}
            <div className="text-7xl mb-4 animate-bounce">
              {currentMilestone.icon}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              {currentMilestone.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-black dark:text-white mb-6">
              {currentMilestone.description}
            </p>

            {/* Gentle Message */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-purple-800 dark:text-purple-200 italic">
                "Cada paso en tu camino de autocuidado merece ser celebrado. 
                Estamos orgullosos de ti." 🌸
              </p>
            </div>

            {/* Close Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleClose}
              fullWidth
            >
              ✨ Continuar
            </Button>
          </Card>
        </div>
      </div>

      {/* Confetti Animation Styles */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
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
