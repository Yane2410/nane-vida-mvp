// Responsiveness update – centered layout + Audio/Haptics feedback
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CenteredContainer from '../components/ui/CenteredContainer';
import { CalmIcon } from '../assets/icons';
import AnimatedCore from '../components/AnimatedCore';
import { soundController } from '../utils/soundController';
import { haptics } from '../sound-engine/utils/haptics';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { useGarden } from '../contexts/GardenContext';
import { useToast } from '../contexts/ToastContext';

interface GroundingItem {
  id: number;
  category: string;
  question: string;
  count: number;
  placeholder: string;
  color: string;
  items: string[];
}

const groundingSteps: GroundingItem[] = [
  {
    id: 1,
    category: 'Vista',
    question: '5 cosas que puedas ver',
    count: 5,
    placeholder: 'Ej: Una lámpara, la ventana, mis manos...',
    color: '#A78BFA',
    items: []
  },
  {
    id: 2,
    category: 'Tacto',
    question: '4 cosas que puedas tocar',
    count: 4,
    placeholder: 'Ej: La textura de mi ropa, el suelo bajo mis pies...',
    color: '#7DD3FC',
    items: []
  },
  {
    id: 3,
    category: 'Oído',
    question: '3 cosas que puedas oír',
    count: 3,
    placeholder: 'Ej: El sonido del tráfico, mi respiración...',
    color: '#FBCFE8',
    items: []
  },
  {
    id: 4,
    category: 'Olfato',
    question: '2 cosas que puedas oler',
    count: 2,
    placeholder: 'Ej: El aroma del café, el aire fresco...',
    color: '#BBF7D0',
    items: []
  },
  {
    id: 5,
    category: 'Gusto',
    question: '1 cosa que puedas saborear',
    count: 1,
    placeholder: 'Ej: El sabor en mi boca ahora mismo...',
    color: '#FED7AA',
    items: []
  }
];

export default function Grounding() {
  const navigate = useNavigate();
  const { isSmall, isTablet } = useWindowDimensions();
  const { plantSeed } = useGarden();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<GroundingItem[]>(groundingSteps);
  const [currentInput, setCurrentInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [enableHaptics, setEnableHaptics] = useState(true);

  // Ambient nature sound loop
  useEffect(() => {
    soundController.playLoop('water', 0.1);
    return () => {
      soundController.stopAll();
    };
  }, []);

  // Play bell + haptic feedback when advancing to next step
  useEffect(() => {
    if (currentStep > 0) {
      soundController.playOnce('bell', 0.3);
      if (enableHaptics) {
        haptics.stepComplete();
      }
    }
  }, [currentStep, enableHaptics]);

  const currentStepData = steps[currentStep];
  const isStepComplete = currentStepData.items.length === currentStepData.count;
  const totalItems = steps.reduce((sum, step) => sum + step.items.length, 0);
  const totalRequired = steps.reduce((sum, step) => sum + step.count, 0);
  const progressPercentage = (totalItems / totalRequired) * 100;

  const addItem = () => {
    if (!currentInput.trim() || isStepComplete) return;

    const updatedSteps = [...steps];
    updatedSteps[currentStep].items.push(currentInput.trim());
    setSteps(updatedSteps);
    setCurrentInput('');

    // Subtle haptic feedback on item added
    if (enableHaptics) {
      haptics.trigger('light');
    }

    // Auto-advance to next step when current is complete
    if (updatedSteps[currentStep].items.length === currentStepData.count) {
      setTimeout(async () => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          setIsComplete(true);
          if (enableHaptics) {
            haptics.sessionEnd();
          }
          // Plant seed when completing grounding exercise
          try {
            await plantSeed('grounding', 5); // 5-4-3-2-1 takes about 5 minutes
            toast.success('🌻 Has plantado una semilla de presencia en tu jardín');
          } catch (error) {
            console.error('Error planting seed:', error);
          }
        }
      }, 500);
    }
  };

  const removeItem = (stepIndex: number, itemIndex: number) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].items.splice(itemIndex, 1);
    setSteps(updatedSteps);
    setIsComplete(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const resetExercise = () => {
    setSteps(groundingSteps.map(step => ({ ...step, items: [] })));
    setCurrentStep(0);
    setCurrentInput('');
    setIsComplete(false);
  };

  const goToStep = (index: number) => {
    if (index <= currentStep || steps[index - 1]?.items.length === steps[index - 1]?.count) {
      setCurrentStep(index);
      setIsComplete(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] animate-fadeIn">
        <CenteredContainer padding="md" fullHeight>
          <div className="w-full max-w-3xl mx-auto">
            <Card
              className="text-center mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.2) 0%, rgba(187, 247, 208, 0.1) 100%)',
                border: '1px solid rgba(187, 247, 208, 0.4)'
              }}
            >
            <div className="text-6xl mb-4" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>
              ✨
            </div>
            <h2 className={`font-bold text-[#333333] mb-3 ${isSmall ? 'text-2xl' : 'text-3xl'}`}>
              ¡Excelente trabajo!
            </h2>
            <p className={`text-[#555555] mb-6 ${isSmall ? 'text-base' : 'text-lg'}`}>
              Has completado el ejercicio de grounding. ¿Te sientes más presente y conectado con el momento actual?
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/50 mb-6">
              <span className="text-[#22C55E] text-2xl">✓</span>
              <span className="font-medium text-[#333333]">15 observaciones completadas</span>
            </div>
          </Card>

          {/* Review all items */}
          <Card className="mb-6">
            <h3 className="text-xl font-bold text-[#333333] mb-4">
              Tu experiencia de grounding
            </h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.count}
                    </div>
                    <h4 className="font-bold text-[#333333]">
                      {step.question}
                    </h4>
                  </div>
                  <div className="pl-10 space-y-1">
                    {step.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[#555555]">
                        <span className="text-[#22C55E]">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={resetExercise}
              variant="primary"
              size={isSmall ? 'md' : 'lg'}
              fullWidth
            >
              Hacer el ejercicio nuevamente
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              size={isSmall ? 'md' : 'lg'}
            >
              Volver al inicio
            </Button>
          </div>

          <Card
            className="mt-6"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
              border: '1px solid rgba(167, 139, 250, 0.3)'
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💜</span>
              <div>
                <h4 className="font-bold text-[#333333] mb-1">
                  Recuerda
                </h4>
                <p className="text-[#555555] text-sm">
                  Puedes usar esta técnica en cualquier momento que te sientas abrumado, ansioso o desconectado. 
                  Es una herramienta poderosa para volver al aquí y ahora.
                </p>
              </div>
            </div>
          </Card>
          </div>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] animate-fadeIn">
      <CenteredContainer padding="md">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
        <Card
          className="mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.1) 0%, rgba(187, 247, 208, 0.05) 100%)',
            border: '1px solid rgba(187, 247, 208, 0.3)'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#BBF7D0]/20 flex items-center justify-center">
              <CalmIcon size={32} color="#22C55E" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#333333] mb-2">
                Técnica de Grounding 5-4-3-2-1
              </h1>
              <p className="text-[#555555] text-lg">
                Un ejercicio sensorial para conectarte con el presente cuando te sientas abrumado o ansioso
              </p>
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#555555]">
              Progreso general
            </span>
            <span className="text-sm font-bold text-[#A78BFA]">
              {totalItems} de {totalRequired} completado
            </span>
          </div>
          <div className="w-full bg-[#F7F5FF] rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-[#A78BFA] to-[#BBF7D0]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </Card>

        {/* Step Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const stepComplete = step.items.length === step.count;
            const isActive = index === currentStep;
            const isClickable = index <= currentStep || (index > 0 && steps[index - 1].items.length === steps[index - 1].count);

            return (
              <AnimatedCore
                key={step.id}
                mode="stepHighlight"
                duration={2000}
                loop={isActive}
                scaleRange={[1, 1.05]}
              >
                <button
                  onClick={() => isClickable && goToStep(index)}
                  disabled={!isClickable}
                  className={`
                    flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-300
                    ${isActive ? 'ring-4 ring-offset-2' : ''}
                    ${stepComplete ? 'opacity-100' : isClickable ? 'opacity-100' : 'opacity-40'}
                    ${isClickable ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-not-allowed'}
                  `}
                  style={{
                    backgroundColor: isActive ? `${step.color}` : `${step.color}30`,
                    color: isActive ? '#ffffff' : '#333333'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {stepComplete && <span>✓</span>}
                    <span>{step.count} {step.category}</span>
                  </div>
                </button>
              </AnimatedCore>
            );
          })}
        </div>

        {/* Current Step */}
        <Card
          className="mb-6"
          style={{
            background: `linear-gradient(135deg, ${currentStepData.color}20 0%, ${currentStepData.color}10 100%)`,
            border: `2px solid ${currentStepData.color}40`
          }}
        >
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-2xl font-bold text-white"
              style={{ backgroundColor: currentStepData.color }}
            >
              {currentStepData.count}
            </div>
            <h2 className="text-2xl font-bold text-[#333333] mb-2">
              Identifica {currentStepData.question}
            </h2>
            <p className="text-[#555555]">
              Tómate tu tiempo para observar a tu alrededor y conectar con tus sentidos
            </p>
          </div>

          {/* Items List */}
          {currentStepData.items.length > 0 && (
            <div className="mb-6 space-y-2">
              {currentStepData.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: currentStepData.color }}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-[#333333]">{item}</span>
                  </div>
                  <button
                    onClick={() => removeItem(currentStep, idx)}
                    className="text-[#EC4899] hover:text-[#DB2777] transition-colors p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          {!isStepComplete && (
            <div className="space-y-3">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentStepData.placeholder}
                className="w-full p-4 border-2 rounded-2xl focus:ring-4 outline-none transition-all text-[#333333]"
                style={{
                  borderColor: `${currentStepData.color}40`
                }}
                autoFocus
              />
              <Button
                onClick={addItem}
                disabled={!currentInput.trim()}
                variant="primary"
                size="lg"
                fullWidth
                style={{
                  background: `linear-gradient(135deg, ${currentStepData.color} 0%, ${currentStepData.color}CC 100%)`
                }}
              >
                Agregar ({currentStepData.items.length}/{currentStepData.count})
              </Button>
            </div>
          )}

          {isStepComplete && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/70 mb-4">
                <span className="text-[#22C55E] text-xl">✓</span>
                <span className="font-medium text-[#333333]">¡Paso completado!</span>
              </div>
            </div>
          )}
        </Card>

        {/* Info */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.1) 0%, rgba(125, 211, 252, 0.05) 100%)',
            border: '1px solid rgba(125, 211, 252, 0.3)'
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💡</span>
            <div>
              <h3 className="font-bold text-[#333333] mb-1">
                ¿Cómo funciona?
              </h3>
              <p className="text-[#555555] text-sm">
                La técnica 5-4-3-2-1 te ayuda a salir de pensamientos ansiosos o recuerdos difíciles,
                trayéndote de vuelta al presente a través de tus cinco sentidos. Es especialmente útil
                durante ataques de pánico o momentos de disociación.
              </p>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            size={isSmall ? 'md' : 'lg'}
          >
            Volver al inicio
          </Button>
        </div>
        </div>
      </CenteredContainer>
    </div>
  );
}
