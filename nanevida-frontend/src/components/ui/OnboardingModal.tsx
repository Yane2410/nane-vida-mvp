import { useOnboarding } from '../../contexts/OnboardingContext'
import Button from './Button'
import AnimatedCore from '../AnimatedCore'

export default function OnboardingModal() {
  const {
    isOnboarding,
    currentStep,
    totalSteps,
    steps,
    nextStep,
    previousStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding()

  if (!isOnboarding) return null

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1
  const progress = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 dark:bg-black/90 backdrop-blur-sm animate-fadeIn">
      <AnimatedCore mode="fadeIn" duration={400} loop={false}>
        <div className="relative w-full max-w-2xl glass dark:bg-gray-800/90 rounded-3xl shadow-strong border-2 border-primary-400/30 dark:border-primary-500/40 overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-300 dark:from-primary-500 dark:to-primary-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12">
            {/* Icon */}
            <div className="text-center mb-6">
              <AnimatedCore mode="pulse" duration={600} loop={false}>
                <div className="text-7xl sm:text-8xl mb-4 inline-block">
                  {step.icon}
                </div>
              </AnimatedCore>
              <div className="text-sm font-medium text-primary-400 dark:text-primary-300 mb-2">
                Paso {currentStep + 1} de {totalSteps}
              </div>
            </div>

            {/* Text */}
            <AnimatedCore mode="fadeIn" duration={500} loop={false}>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {step.title}
                </h2>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
                  {step.description}
                </p>
              </div>
            </AnimatedCore>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Skip/Back button */}
              <div className="w-full sm:w-auto">
                {isFirstStep ? (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={skipOnboarding}
                    className="w-full sm:w-auto"
                  >
                    Saltar introducción
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={previousStep}
                    className="w-full sm:w-auto"
                  >
                    ← Anterior
                  </Button>
                )}
              </div>

              {/* Next/Finish button */}
              <div className="w-full sm:w-auto">
                {isLastStep ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={completeOnboarding}
                    className="w-full sm:w-auto"
                  >
                    ¡Comenzar! 🎉
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={nextStep}
                    className="w-full sm:w-auto"
                  >
                    Siguiente →
                  </Button>
                )}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Allow jumping to any previous step
                    if (index <= currentStep) {
                      // This would require adding a goToStep function in context
                    }
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentStep
                      ? 'bg-primary-400 dark:bg-primary-300 w-8'
                      : index < currentStep
                        ? 'bg-primary-300 dark:bg-primary-400'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }
                  `}
                  aria-label={`Ir al paso ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedCore>
    </div>
  )
}
