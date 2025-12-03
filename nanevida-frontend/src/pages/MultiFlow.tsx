/**
 * MultiFlow - Combined wellness sessions
 * Orchestrates multiple tools in sequence with smooth transitions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CenteredContainer from '../components/ui/CenteredContainer';
import AnimatedCore from '../components/AnimatedCore';
import { FlowerIcon } from '../assets/icons';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import {
  multiFlowManager,
  predefinedSessions,
  type MultiFlowSession,
  type FlowStep
} from '../utils/multiFlowSession';

export default function MultiFlow() {
  const navigate = useNavigate();
  const { isSmall, isTablet } = useWindowDimensions();
  const [selectedSession, setSelectedSession] = useState<MultiFlowSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<FlowStep | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Setup callbacks for multi-flow manager
  useEffect(() => {
    multiFlowManager.onPhaseChange((step, index) => {
      setCurrentStep(step);
      setCurrentStepIndex(index);
      setTimeLeft(step.duration * 60); // Convert to seconds
    });

    multiFlowManager.onSessionEnd(() => {
      setIsActive(false);
      setSelectedSession(null);
      setCurrentStep(null);
      setCurrentStepIndex(0);
      setProgress(100);
    });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isActive || !currentStep) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next step
          multiFlowManager.transitionToNextStep();
          return 0;
        }
        return prev - 1;
      });

      // Update progress
      setProgress(multiFlowManager.getProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentStep]);

  const startSession = (session: MultiFlowSession) => {
    setSelectedSession(session);
    setIsActive(true);
    setProgress(0);
    multiFlowManager.startSession(session, true);
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    if (isActive) {
      multiFlowManager.pauseSession();
    } else {
      multiFlowManager.resumeSession();
    }
  };

  const stopSession = () => {
    multiFlowManager.endSession();
    setIsActive(false);
    setSelectedSession(null);
    setCurrentStep(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getToolIcon = (tool: string): string => {
    const icons: Record<string, string> = {
      breath: '🫁',
      calm: '☁️',
      grounding: '🌿',
      reflection: '✨'
    };
    return icons[tool] || '🌟';
  };

  const getToolColor = (tool: string): string => {
    const colors: Record<string, string> = {
      breath: '#A78BFA',
      calm: '#7DD3FC',
      grounding: '#BBF7D0',
      reflection: '#FBCFE8'
    };
    return colors[tool] || '#A78BFA';
  };

  // Active session view
  if (isActive && selectedSession && currentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
        <CenteredContainer padding="md" fullHeight>
          <Card className="text-center">
            {/* Session Header */}
            <div className="mb-6">
              <h2 className={`${isSmall ? 'text-xl' : 'text-2xl'} font-bold text-[#333333] mb-2`}>
                {selectedSession.name}
              </h2>
              <p className="text-[#555555] text-sm">
                Paso {currentStepIndex + 1} de {selectedSession.steps.length}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-[#F7F5FF] rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: getToolColor(currentStep.tool)
                  }}
                />
              </div>
              <p className="text-sm text-[#555555]">{Math.round(progress)}% completado</p>
            </div>

            {/* Current Step */}
            <AnimatedCore mode="pulse" duration={3000} loop scaleRange={[0.95, 1.05]}>
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mb-6 mx-auto"
                style={{
                  backgroundColor: `${getToolColor(currentStep.tool)}20`,
                  border: `3px solid ${getToolColor(currentStep.tool)}40`
                }}
              >
                <span className="text-6xl">{getToolIcon(currentStep.tool)}</span>
              </div>
            </AnimatedCore>

            {/* Tool Name */}
            <h3 className={`${isSmall ? 'text-2xl' : 'text-3xl'} font-bold text-[#333333] mb-2`}>
              {currentStep.tool.charAt(0).toUpperCase() + currentStep.tool.slice(1)}
            </h3>

            {/* Timer */}
            <div className="mb-8">
              <div className={`${isSmall ? 'text-5xl' : 'text-6xl'} font-bold text-[#333333] mb-2`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-[#555555]">
                {currentStep.duration} minutos de práctica
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={pauseSession} variant="secondary" size={isSmall ? 'md' : 'lg'}>
                {isActive ? 'Pausar' : 'Reanudar'}
              </Button>
              <Button onClick={stopSession} variant="ghost" size={isSmall ? 'md' : 'lg'}>
                Terminar sesión
              </Button>
            </div>

            {/* Next Step Preview */}
            {currentStepIndex < selectedSession.steps.length - 1 && (
              <AnimatedCore mode="fadeIn" duration={800}>
                <Card
                  className="mt-6 bg-gradient-to-r from-[#A78BFA]/10 to-[#7DD3FC]/10"
                >
                  <p className="text-sm text-[#555555]">
                    <strong>Siguiente:</strong>{' '}
                    {getToolIcon(selectedSession.steps[currentStepIndex + 1].tool)}{' '}
                    {selectedSession.steps[currentStepIndex + 1].tool.charAt(0).toUpperCase() +
                      selectedSession.steps[currentStepIndex + 1].tool.slice(1)}{' '}
                    ({selectedSession.steps[currentStepIndex + 1].duration} min)
                  </p>
                </Card>
              </AnimatedCore>
            )}
          </Card>
        </CenteredContainer>
      </div>
    );
  }

  // Session selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 animate-fadeIn">
      <CenteredContainer padding="md">
        {/* Header */}
        <Card gradient className="text-center mb-8">
          <AnimatedCore mode="pulse" duration={4000} loop scaleRange={[0.95, 1.05]}>
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[#A78BFA]/20">
              <FlowerIcon size={32} color="#A78BFA" />
            </div>
          </AnimatedCore>
          <h1 className={`${isSmall ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl'} font-bold text-[#333333] mb-3`}>
            Sesiones Multi-Flujo
          </h1>
          <p className={`text-[#444444] ${isSmall ? 'text-sm' : 'text-base sm:text-lg'} max-w-2xl mx-auto leading-relaxed`}>
            Combina múltiples herramientas de bienestar en una sesión guiada. Perfectas para crear rutinas personalizadas de autocuidado.
          </p>
        </Card>

        {/* Predefined Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {predefinedSessions.map((session) => (
            <AnimatedCore key={session.name} mode="fadeIn" duration={600} delay={100}>
              <Card hover className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-[#333333] mb-2`}>
                    {session.name}
                  </h3>
                  <p className={`text-[#555555] mb-4 ${isSmall ? 'text-sm' : ''}`}>
                    {session.description}
                  </p>
                </div>

                {/* Steps Preview */}
                <div className="space-y-2 mb-4 flex-1">
                  {session.steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg"
                      style={{ backgroundColor: `${getToolColor(step.tool)}15` }}
                    >
                      <span className="flex items-center gap-2 text-sm text-[#555555]">
                        <span className="text-lg">{getToolIcon(step.tool)}</span>
                        {step.tool.charAt(0).toUpperCase() + step.tool.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-[#333333]">
                        {step.duration} min
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Duration */}
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#A78BFA]/20 text-[#A78BFA] text-sm font-medium">
                    ⏱️ {session.totalDuration} minutos total
                  </div>
                </div>

                <Button
                  onClick={() => startSession(session)}
                  variant="primary"
                  fullWidth
                  size={isSmall ? 'md' : 'lg'}
                >
                  Comenzar sesión
                </Button>
              </Card>
            </AnimatedCore>
          ))}
        </div>

        {/* Benefits */}
        <Card>
          <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-[#333333] mb-4 flex items-center gap-2`}>
            <span>💡</span>
            ¿Por qué sesiones multi-flujo?
          </h3>
          <ul className={`space-y-3 text-[#555555] ${isSmall ? 'text-sm' : ''}`}>
            <li className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span>Combina técnicas complementarias para mayor efecto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span>Transiciones suaves entre herramientas con audio guiado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span>Duración perfecta para pausas de autocuidado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span>Feedback háptico sincronizado para mayor inmersión</span>
            </li>
          </ul>
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
      </CenteredContainer>
    </div>
  );
}
