import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: string
  action?: () => void
}

interface OnboardingContextType {
  isOnboarding: boolean
  currentStep: number
  totalSteps: number
  steps: OnboardingStep[]
  nextStep: () => void
  previousStep: () => void
  skipOnboarding: () => void
  completeOnboarding: () => void
  startOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

const ONBOARDING_KEY = 'nanevida_onboarding_completed'

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: '¡Te damos la bienvenida a Nane Vida! 💜',
    description: 'Un espacio seguro para cuidar tu salud mental y emocional. Aquí encontrarás herramientas diseñadas para acompañarte en tu camino hacia el bienestar.',
    icon: '🌸'
  },
  {
    id: 2,
    title: 'Reconoce tus emociones',
    description: 'Comienza cada día registrando cómo te sientes. No hay emociones buenas o malas, todas son válidas y merecen ser reconocidas.',
    icon: '💭'
  },
  {
    id: 3,
    title: 'Ejercicios de respiración',
    description: 'Calma tu mente con ejercicios guiados de respiración. Perfectos para momentos de ansiedad o cuando necesites un descanso mental.',
    icon: '🌬️'
  },
  {
    id: 4,
    title: 'Técnicas de calma rápida',
    description: 'Herramientas de 5 minutos para encontrar paz en momentos difíciles. Técnicas de grounding, afirmaciones positivas y más.',
    icon: '✨'
  },
  {
    id: 5,
    title: 'Tu diario personal',
    description: 'Escribe libremente sobre tus pensamientos y emociones. Un espacio privado para expresarte sin juicios.',
    icon: '📔'
  },
  {
    id: 6,
    title: 'Reflexiones guiadas',
    description: 'Preguntas cuidadosamente diseñadas para ayudarte a conocerte mejor y conectar con tus necesidades más profundas.',
    icon: '🌺'
  },
  {
    id: 7,
    title: '¡Ya puedes comenzar! 🎉',
    description: 'Recuerda: esto es un viaje, no un destino. Avanza a tu propio ritmo y sé amable contigo.',
    icon: '🦋'
  }
]

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      // Auto-start onboarding for new users
      setIsOnboarding(true)
    }
  }, [])

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'skipped')
    setIsOnboarding(false)
    setCurrentStep(0)
  }

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'completed')
    setIsOnboarding(false)
    setCurrentStep(0)
  }

  const startOnboarding = () => {
    setCurrentStep(0)
    setIsOnboarding(true)
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        totalSteps: onboardingSteps.length,
        steps: onboardingSteps,
        nextStep,
        previousStep,
        skipOnboarding,
        completeOnboarding,
        startOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
