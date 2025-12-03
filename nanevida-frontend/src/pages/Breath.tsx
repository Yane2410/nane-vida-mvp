// Responsiveness update - centered layout with dynamic sizing + Audio/Haptics sync
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BreathIcon } from '../assets/icons';
import AnimatedCore from '../components/AnimatedCore';
import { soundController } from '../utils/soundController';
import { haptics } from '../sound-engine/utils/haptics';
import CenteredContainer from '../components/ui/CenteredContainer';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { useToast } from '../contexts/ToastContext';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathCycle {
  phase: BreathPhase;
  duration: number;
  instruction: string;
}

const breathingPatterns = [
  {
    name: 'Respiración 4-4-4 (Cuadrada)',
    description: 'Equilibra tu sistema nervioso con un patrón simple y efectivo',
    cycles: [
      { phase: 'inhale' as BreathPhase, duration: 4, instruction: 'Inhala profundamente' },
      { phase: 'hold' as BreathPhase, duration: 4, instruction: 'Sostén el aire' },
      { phase: 'exhale' as BreathPhase, duration: 4, instruction: 'Exhala suavemente' },
      { phase: 'rest' as BreathPhase, duration: 4, instruction: 'Descansa' }
    ],
    color: '#A78BFA'
  },
  {
    name: 'Respiración 4-7-8 (Relajante)',
    description: 'Ideal para calmar la ansiedad y prepararte para dormir',
    cycles: [
      { phase: 'inhale' as BreathPhase, duration: 4, instruction: 'Inhala por la nariz' },
      { phase: 'hold' as BreathPhase, duration: 7, instruction: 'Sostén la respiración' },
      { phase: 'exhale' as BreathPhase, duration: 8, instruction: 'Exhala por la boca' }
    ],
    color: '#7DD3FC'
  }
];

export default function Breath() {
  const navigate = useNavigate();
  const { width, isSmall, isTablet } = useWindowDimensions();
  const toast = useToast();
  
  // Dynamic circle size based on screen
  const getCircleSize = () => {
    if (isSmall) return Math.min(width * 0.7, 280);
    if (isTablet) return 360;
    return 320;
  };
  const circleSize = getCircleSize();
  const radius = circleSize / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  
  const [selectedPattern, setSelectedPattern] = useState<typeof breathingPatterns[0] | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [scale, setScale] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [enableHaptics, setEnableHaptics] = useState(true);

  // Sound management - wind loop when active
  useEffect(() => {
    if (isActive && selectedPattern) {
      soundController.playLoop('breath', 0.15);
    }
    return () => {
      soundController.stopAll();
    };
  }, [isActive, selectedPattern]);

  // Enhanced phase change with audio + haptics sync
  useEffect(() => {
    if (isActive && selectedPattern) {
      const currentCycle = selectedPattern.cycles[currentCycleIndex];
      
      // Play bell on phase transition
      soundController.playOnce('bell', 0.3);
      
      // Trigger haptic feedback based on phase
      if (enableHaptics) {
        if (currentCycle.phase === 'inhale') {
          haptics.breathPattern('inhale');
        } else if (currentCycle.phase === 'hold' || currentCycle.phase === 'rest') {
          haptics.breathPattern('hold');
        } else if (currentCycle.phase === 'exhale') {
          haptics.breathPattern('exhale');
        }
      }

      // Update current phase for AnimatedCore
      if (currentCycle.phase !== 'rest') {
        setCurrentPhase(currentCycle.phase as 'inhale' | 'hold' | 'exhale');
      }
    }
  }, [currentCycleIndex, isActive, selectedPattern, enableHaptics]);

  useEffect(() => {
    if (!isActive || !selectedPattern) return;

    const currentCycle = selectedPattern.cycles[currentCycleIndex];
    
    if (secondsLeft === 0) {
      setSecondsLeft(currentCycle.duration);
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Move to next cycle
          const nextIndex = (currentCycleIndex + 1) % selectedPattern.cycles.length;
          setCurrentCycleIndex(nextIndex);
          
          // Count completed full cycles
          if (nextIndex === 0) {
            setCompletedCycles((c) => {
              const newCount = c + 1;
              if (newCount === 3) {
                toast.success('¡Excelente! Has completado 3 ciclos de respiración');
              }
              return newCount;
            });
          }
          
          return selectedPattern.cycles[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, selectedPattern, currentCycleIndex, secondsLeft]);

  // Animation scale effect
  useEffect(() => {
    if (!isActive || !selectedPattern) return;

    const currentCycle = selectedPattern.cycles[currentCycleIndex];
    const totalDuration = currentCycle.duration * 1000;
    const progress = ((currentCycle.duration - secondsLeft) / currentCycle.duration);

    if (currentCycle.phase === 'inhale') {
      setScale(1 + progress * 0.5); // Scale from 1 to 1.5
    } else if (currentCycle.phase === 'exhale') {
      setScale(1.5 - progress * 0.5); // Scale from 1.5 to 1
    } else if (currentCycle.phase === 'hold') {
      setScale(1.5); // Stay expanded
    } else {
      setScale(1); // Rest at normal size
    }
  }, [isActive, selectedPattern, currentCycleIndex, secondsLeft]);

  const startExercise = (pattern: typeof breathingPatterns[0]) => {
    setSelectedPattern(pattern);
    setIsActive(true);
    setCurrentCycleIndex(0);
    setSecondsLeft(pattern.cycles[0].duration);
    setCompletedCycles(0);
    setScale(1);
  };

  const stopExercise = () => {
    if (completedCycles > 0) {
      toast.success(`Sesión completada: ${completedCycles} ciclo${completedCycles !== 1 ? 's' : ''}`);
    }
    setIsActive(false);
    setSelectedPattern(null);
    setCurrentCycleIndex(0);
    setSecondsLeft(0);
    setCompletedCycles(0);
    setScale(1);
    soundController.stopAll();
    if (enableHaptics) {
      haptics.sessionEnd();
    }
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
    if (enableHaptics) {
      haptics.trigger('medium');
    }
  };

  if (selectedPattern && isActive !== null) {
    const currentCycle = selectedPattern.cycles[currentCycleIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
        <CenteredContainer padding="md" fullHeight>
          <Card className="text-center">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#333333] mb-2">
                {selectedPattern.name}
              </h2>
              <p className="text-[#555555]">
                {completedCycles} ciclo{completedCycles !== 1 ? 's' : ''} completado{completedCycles !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Breathing Circle Animation - Enhanced with phase-based control */}
            <div className="flex items-center justify-center mb-8">
              <AnimatedCore
                mode="breath"
                duration={currentCycle.duration * 1000}
                loop={false}
                scaleRange={[0.8, 1.2]}
                breathPhase={currentCycle.phase !== 'rest' ? currentCycle.phase as 'inhale' | 'hold' | 'exhale' : 'exhale'}
                easingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <div className="relative" style={{ width: `${circleSize}px`, height: `${circleSize}px` }}>
                  <div
                    className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
                    style={{
                      background: `radial-gradient(circle, ${selectedPattern.color}40, ${selectedPattern.color}20)`,
                      boxShadow: `0 0 ${scale * 60}px ${selectedPattern.color}60`
                    }}
                  >
                    <div className="text-center">
                      <div className={`${isSmall ? 'text-5xl' : 'text-6xl'} font-bold text-[#333333] mb-2`}>
                        {secondsLeft}
                      </div>
                      <div className={`${isSmall ? 'text-lg' : 'text-xl'} font-medium text-[#555555]`}>
                        {currentCycle.instruction}
                      </div>
                    </div>
                  </div>

                  {/* Outer ring - Progreso completo */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx={circleSize / 2}
                      cy={circleSize / 2}
                      r={radius}
                      stroke={`${selectedPattern.color}30`}
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx={circleSize / 2}
                      cy={circleSize / 2}
                      r={radius}
                      stroke={selectedPattern.color}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - (currentCycle.duration - secondsLeft) / currentCycle.duration)}
                      className="transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </AnimatedCore>
            </div>

            {/* Phase Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {selectedPattern.cycles.map((cycle, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCycleIndex
                      ? 'scale-125'
                      : 'opacity-30'
                  }`}
                  style={{ backgroundColor: selectedPattern.color }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
              <Button
                onClick={pauseExercise}
                variant="secondary"
                size={isSmall ? 'md' : 'lg'}
              >
                {isActive ? 'Pausar' : 'Reanudar'}
              </Button>
              <Button
                onClick={stopExercise}
                variant="ghost"
                size={isSmall ? 'md' : 'lg'}
              >
                Terminar
              </Button>
            </div>

            {/* Haptics Toggle */}
            {haptics.isAvailable() && (
              <div className="flex items-center justify-center gap-2 text-sm text-[#555555]">
                <input
                  type="checkbox"
                  id="haptics-toggle"
                  checked={enableHaptics}
                  onChange={(e) => setEnableHaptics(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="haptics-toggle" className="cursor-pointer">
                  Vibración activada
                </label>
              </div>
            )}

            {/* Tip */}
            {completedCycles >= 3 && (
              <Card
                className="mt-6 animate-fadeIn"
                style={{
                  background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.2) 0%, rgba(187, 247, 208, 0.1) 100%)',
                  border: '1px solid rgba(187, 247, 208, 0.4)'
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🌟</span>
                  <p className="text-[#555555] text-sm text-left">
                    Vas muy bien. Observa cómo tu cuerpo y mente se sienten más calmados con cada respiración.
                  </p>
                </div>
              </Card>
            )}
          </Card>
        </CenteredContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 animate-fadeIn">
      <CenteredContainer padding="md">
        {/* Header */}
        <Card
          className="mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.3)'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#A78BFA]/20 flex items-center justify-center">
              <BreathIcon size={32} color="#A78BFA" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#333333] mb-2">
                Respiración Guiada
              </h1>
              <p className="text-[#555555] text-lg">
                Ejercicios de respiración consciente para reducir el estrés y encontrar calma interior
              </p>
            </div>
          </div>
        </Card>

        {/* Patterns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {breathingPatterns.map((pattern, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => startExercise(pattern)}
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${pattern.color}30` }}
                  >
                    <BreathIcon size={24} color={pattern.color} />
                  </div>
                  <h3 className={`${isSmall ? 'text-lg' : 'text-xl'} font-bold text-[#333333] mb-2`}>
                    {pattern.name}
                  </h3>
                  <p className={`text-[#555555] mb-4 ${isSmall ? 'text-sm' : ''}`}>
                    {pattern.description}
                  </p>
                </div>

              <div className="space-y-2 mb-4">
                {pattern.cycles.map((cycle, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm p-2 rounded-lg"
                    style={{ backgroundColor: `${pattern.color}10` }}
                  >
                    <span className="text-[#555555]">{cycle.instruction}</span>
                    <span className="font-bold text-[#333333]">{cycle.duration}s</span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                fullWidth
                size={isSmall ? 'md' : 'lg'}
              >
                Comenzar ejercicio
              </Button>
              </Card>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.2) 0%, rgba(125, 211, 252, 0.1) 100%)',
            border: '1px solid rgba(125, 211, 252, 0.4)'
          }}
        >
          <h3 className="text-xl font-bold text-[#333333] mb-4 flex items-center gap-2">
            <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💙</span>
            Beneficios de la respiración consciente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span className="text-[#555555]">Reduce la ansiedad y el estrés</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span className="text-[#555555]">Mejora la concentración</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span className="text-[#555555]">Calma el sistema nervioso</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#22C55E] font-bold mt-1">✓</span>
              <span className="text-[#555555]">Ayuda a conciliar el sueño</span>
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
      </CenteredContainer>
    </div>
  );
}
