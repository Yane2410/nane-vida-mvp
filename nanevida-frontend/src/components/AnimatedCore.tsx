import { useEffect, useState, ReactNode } from 'react';

interface AnimatedCoreProps {
  children: ReactNode;
  mode?: 'pulse' | 'breath' | 'stepHighlight' | 'fadeIn';
  scaleRange?: [number, number];
  duration?: number;
  loop?: boolean;
  delay?: number;
  onStep?: () => void;
  className?: string;
}

export default function AnimatedCore({
  children,
  mode = 'pulse',
  scaleRange = [0.95, 1.05],
  duration = 2000,
  loop = true,
  delay = 0,
  onStep,
  className = ''
}: AnimatedCoreProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (onStep) onStep();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onStep]);

  const getAnimationStyle = () => {
    const [minScale, maxScale] = scaleRange;
    const durationSec = duration / 1000;

    switch (mode) {
      case 'pulse':
        return {
          animation: `animatedPulse ${durationSec}s ease-in-out ${loop ? 'infinite' : '1'}`,
          '--min-scale': minScale,
          '--max-scale': maxScale
        } as React.CSSProperties;

      case 'breath':
        return {
          animation: `animatedBreath ${durationSec}s ease-in-out ${loop ? 'infinite' : '1'}`,
          '--min-scale': minScale,
          '--max-scale': maxScale
        } as React.CSSProperties;

      case 'stepHighlight':
        return {
          animation: `animatedHighlight ${durationSec}s ease-out ${loop ? 'infinite' : '1'}`,
          '--min-scale': minScale,
          '--max-scale': maxScale
        } as React.CSSProperties;

      case 'fadeIn':
        return {
          animation: `animatedFadeIn ${durationSec}s ease-out forwards`,
          opacity: 0
        } as React.CSSProperties;

      default:
        return {};
    }
  };

  if (!isVisible && delay > 0) {
    return <div style={{ opacity: 0 }}>{children}</div>;
  }

  return (
    <div className={className} style={getAnimationStyle()}>
      {children}
      <style>{`
        @keyframes animatedPulse {
          0%, 100% {
            transform: scale(var(--min-scale, 1));
          }
          50% {
            transform: scale(var(--max-scale, 1.05));
          }
        }

        @keyframes animatedBreath {
          0% {
            transform: scale(var(--min-scale, 1));
          }
          40% {
            transform: scale(var(--max-scale, 1.2));
          }
          50% {
            transform: scale(var(--max-scale, 1.2));
          }
          90% {
            transform: scale(var(--min-scale, 1));
          }
          100% {
            transform: scale(var(--min-scale, 1));
          }
        }

        @keyframes animatedHighlight {
          0% {
            transform: scale(var(--min-scale, 1));
            opacity: 0.7;
          }
          50% {
            transform: scale(var(--max-scale, 1.1));
            opacity: 1;
          }
          100% {
            transform: scale(var(--min-scale, 1));
            opacity: 0.7;
          }
        }

        @keyframes animatedFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
