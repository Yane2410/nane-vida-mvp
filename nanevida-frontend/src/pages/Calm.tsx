// Responsiveness update - centered layout with dynamic sizing + Audio/Haptics sync
import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { CloudIcon, HeartIcon, CalmIcon } from '../assets/icons'
import AnimatedCore from '../components/AnimatedCore'
import { soundController } from '../utils/soundController'
import { haptics } from '../sound-engine/utils/haptics'
import CenteredContainer from '../components/ui/CenteredContainer'
import { useWindowDimensions } from '../hooks/useWindowDimensions'
import { useGarden } from '../contexts/GardenContext'
import { useToast } from '../contexts/ToastContext'

type Technique = {
  id: number
  title: string
  description: string
  duration: string
  steps: string[]
  icon: JSX.Element
  color: string
}

const techniques: Technique[] = [
  {
    id: 1,
    title: 'Respiración 4-7-8',
    description: 'Una técnica simple que ayuda a calmar el sistema nervioso en minutos.',
    duration: '3-5 minutos',
    icon: <CloudIcon size={32} />,
    color: '#7DD3FC',
    steps: [
      'Siéntate cómodamente con la espalda recta',
      'Exhala completamente por la boca haciendo un sonido suave',
      'Inhala por la nariz contando hasta 4',
      'Mantén la respiración contando hasta 7',
      'Exhala por la boca contando hasta 8',
      'Repite este ciclo 4 veces',
      'Observa cómo tu cuerpo se relaja con cada respiración'
    ]
  },
  {
    id: 2,
    title: 'Relajación Muscular Progresiva',
    description: 'Libera la tensión física que a menudo acompaña la ansiedad.',
    duration: '5-7 minutos',
    icon: <HeartIcon size={32} />,
    color: '#FBCFE8',
    steps: [
      'Encuentra un lugar tranquilo donde puedas sentarte o recostarte',
      'Comienza por tus pies: tensa los músculos durante 5 segundos',
      'Suelta la tensión y observa la sensación de relajación',
      'Continúa con las pantorrillas, muslos, abdomen',
      'Sube hacia los hombros, brazos y manos',
      'Termina con el cuello y rostro',
      'Respira profundamente y disfruta de la sensación de calma'
    ]
  },
  {
    id: 3,
    title: 'Visualización del Lugar Seguro',
    description: 'Crea un refugio mental donde puedas sentirte protegido y en paz.',
    duration: '5 minutos',
    icon: <CalmIcon size={32} />,
    color: '#A78BFA',
    steps: [
      'Cierra los ojos y respira profundamente',
      'Imagina un lugar donde te sientas completamente seguro',
      'Puede ser real o imaginario: una playa, montaña, habitación acogedora',
      'Observa los detalles: colores, sonidos, aromas',
      '¿Qué temperatura sientes? ¿Qué texturas tocas?',
      'Permite que tu cuerpo se relaje en este espacio',
      'Recuerda que puedes volver aquí siempre que lo necesites'
    ]
  },
  {
    id: 4,
    title: 'Técnica de la Mano',
    description: 'Un ejercicio táctil que puedes hacer en cualquier momento y lugar.',
    duration: '2-3 minutos',
    icon: <HeartIcon size={32} />,
    color: '#BBF7D0',
    steps: [
      'Coloca tu mano izquierda abierta frente a ti',
      'Con tu dedo índice derecho, traza el contorno de tu mano',
      'Al subir por el pulgar, inhala lentamente',
      'Al bajar, exhala lentamente',
      'Continúa trazando cada dedo con este ritmo',
      'Siente la conexión entre tu respiración y el movimiento',
      'Repite si lo necesitas hasta sentirte más tranquilo'
    ]
  }
]

export default function Calm() {
  const { isSmall, isTablet } = useWindowDimensions();
  const { plantSeed } = useGarden();
  const toast = useToast();
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [enableHaptics, setEnableHaptics] = useState(true)

  // Sound management - soft wind loop
  useEffect(() => {
    soundController.playLoop('wind', 0.1);
    return () => {
      soundController.stopAll();
    };
  }, []);

  // Haptic feedback on step change
  useEffect(() => {
    if (isActive && enableHaptics) {
      haptics.techniqueTransition();
    }
  }, [currentStep, isActive, enableHaptics]);

  const startTechnique = (technique: Technique) => {
    setSelectedTechnique(technique)
    setCurrentStep(0)
    setIsActive(true)
    soundController.playOnce('bell', 0.3)
    if (enableHaptics) {
      haptics.sessionStart()
    }
  }

  const nextStep = () => {
    if (selectedTechnique && currentStep < selectedTechnique.steps.length - 1) {
      setCurrentStep(currentStep + 1)
      soundController.playOnce('bell', 0.2)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      soundController.playOnce('bell', 0.2)
    }
  }

  const closeTechnique = async () => {
    // Plant seed when completing a technique
    if (selectedTechnique && currentStep === selectedTechnique.steps.length - 1) {
      try {
        // Extract approximate duration in minutes
        const durationMatch = selectedTechnique.duration.match(/(\d+)/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 5;
        await plantSeed('calm', durationMinutes);
        toast.success('💜 Has plantado una semilla de calma en tu jardín');
      } catch (error) {
        console.error('Error planting seed:', error);
      }
    }
    
    setIsActive(false)
    setSelectedTechnique(null)
    setCurrentStep(0)
    if (enableHaptics) {
      haptics.sessionEnd()
    }
  }

  if (isActive && selectedTechnique) {
    return (
      <CenteredContainer padding="md" fullHeight>
        <AnimatedCore mode="fadeIn" duration={500}>
        <Card gradient className="mb-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl" style={{ backgroundColor: `${selectedTechnique.color}40` }}>
              {selectedTechnique.icon}
            </div>
            <h2 className={`${isSmall ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl'} font-bold text-[#333333] mb-2`}>
              {selectedTechnique.title}
            </h2>
            <p className={`text-[#555555] mb-2 ${isSmall ? 'text-sm' : ''}`}>
              {selectedTechnique.description}
            </p>
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${selectedTechnique.color}30`, color: '#333333' }}>
              ⏱️ {selectedTechnique.duration}
            </span>
          </div>
        </Card>

        {/* Progress */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#555555]">
              Paso {currentStep + 1} de {selectedTechnique.steps.length}
            </span>
            <span className="text-sm font-medium text-[#A78BFA]">
              {Math.round(((currentStep + 1) / selectedTechnique.steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[#F7F5FF] rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${((currentStep + 1) / selectedTechnique.steps.length) * 100}%`,
                backgroundColor: selectedTechnique.color 
              }}
            />
          </div>
        </Card>

        {/* Current Step - FadeIn animation per step */}
        <AnimatedCore mode="fadeIn" duration={600} key={currentStep}>
        <Card className="mb-6 text-center min-h-[200px] flex items-center justify-center">
          <div className="max-w-xl mx-auto">
            <p className={`${isSmall ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'} text-gray-900 dark:text-gray-100 leading-relaxed font-medium`}>
              {selectedTechnique.steps[currentStep]}
            </p>
          </div>
        </Card>
        </AnimatedCore>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={previousStep}
            disabled={currentStep === 0}
            fullWidth
            size={isSmall ? 'md' : 'lg'}
          >
            ← Anterior
          </Button>
          
          {currentStep < selectedTechnique.steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              fullWidth
              size={isSmall ? 'md' : 'lg'}
            >
              Siguiente →
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={closeTechnique}
              fullWidth
              size={isSmall ? 'md' : 'lg'}
            >
              ✓ Completado
            </Button>
          )}
          
          <Button
            variant="ghost"
            onClick={closeTechnique}
            size={isSmall ? 'md' : 'lg'}
          >
            Salir
          </Button>
        </div>

        {/* Encouragement */}
        {currentStep === selectedTechnique.steps.length - 1 && (
          <AnimatedCore mode="fadeIn" duration={800}>
          <Card className="mt-6 bg-gradient-to-r from-[#BBF7D0]/30 to-[#7DD3FC]/30 border-[#BBF7D0]/40">
            <div className="text-center">
              <p className="text-[#333333] font-medium mb-2">
                ¡Excelente trabajo! 🌟
              </p>
              <p className="text-[#555555] text-sm">
                Has completado este ejercicio. Tómate un momento para observar cómo te sientes ahora.
              </p>
            </div>
          </Card>
          </AnimatedCore>
        )}
        
        {/* Haptics Toggle */}
        {haptics.isAvailable() && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-4">
            <input
              type="checkbox"
              id="calm-haptics-toggle"
              checked={enableHaptics}
              onChange={(e) => setEnableHaptics(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="calm-haptics-toggle" className="cursor-pointer">
              Vibración activada
            </label>
          </div>
        )}
        </AnimatedCore>
      </CenteredContainer>
    )
  }

  return (
    <CenteredContainer padding="md">
      {/* Header */}
      <Card gradient className="text-center">
        <AnimatedCore
          mode="pulse"
          duration={6000}
          loop={true}
          scaleRange={[0.95, 1.05]}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[#7DD3FC]/20">
            <CloudIcon size={32} color="#7DD3FC" />
          </div>
        </AnimatedCore>
        <h1 className={`${isSmall ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold text-[#333333] mb-3`}>
          Técnicas de Calma Rápida
        </h1>
        <p className={`text-[#444444] ${isSmall ? 'text-sm' : 'text-base sm:text-lg'} max-w-2xl mx-auto leading-relaxed`}>
          Cuando sientas ansiedad o estrés, estas técnicas pueden ayudarte a encontrar paz en pocos minutos.
          Elige la que más resuene contigo en este momento.
        </p>
      </Card>

      {/* Techniques Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techniques.map((technique) => (
          <Card key={technique.id} hover className="flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div 
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${technique.color}40` }}
              >
                {technique.icon}
              </div>
              <div className="flex-1">
                <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-gray-900 dark:text-gray-100 mb-1`}>
                  {technique.title}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${technique.color}30`, color: '#555555' }}>
                  ⏱️ {technique.duration}
                </span>
              </div>
            </div>
            
            <p className={`text-[#555555] mb-4 flex-1 ${isSmall ? 'text-sm' : ''}`}>
              {technique.description}
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-[#444444] mb-2">
                Incluye {technique.steps.length} pasos guiados
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => startTechnique(technique)}
              fullWidth
              size={isSmall ? 'md' : 'lg'}
            >
              Comenzar ejercicio
            </Button>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card>
        <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-[#333333] mb-4 flex items-center gap-2`}>
          <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💡</span>
          Consejos para aprovechar al máximo
        </h3>
        <ul className={`space-y-3 text-[#555555] ${isSmall ? 'text-sm' : ''}`}>
          <li className="flex items-start gap-2">
            <span className="text-[#22C55E] font-bold mt-1">✓</span>
            <span>Encuentra un lugar tranquilo donde no te interrumpan</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#22C55E] font-bold mt-1">✓</span>
            <span>No hay forma incorrecta de hacer estos ejercicios, hazlos a tu ritmo</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#22C55E] font-bold mt-1">✓</span>
            <span>La práctica regular te ayudará a sentir los beneficios más rápido</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#22C55E] font-bold mt-1">✓</span>
            <span>Si te sientes abrumado en algún momento, puedes pausar o salir</span>
          </li>
        </ul>
      </Card>
    </CenteredContainer>
  )
}
