// Responsiveness update – centered layout container
import { ReactNode, CSSProperties, memo } from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

interface CenteredContainerProps {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  backgroundColor?: string;
  className?: string;
  fullHeight?: boolean;
  maxWidth?: number;
}

const CenteredContainer = memo(function CenteredContainer({
  children,
  padding = 'md',
  backgroundColor = 'transparent',
  className = '',
  fullHeight = true,
  maxWidth,
}: CenteredContainerProps) {
  const { isSmall, isMedium, isTablet } = useWindowDimensions();

  // Responsive padding
  const paddingMap = {
    none: 'px-0',
    sm: isSmall ? 'px-4' : isMedium ? 'px-6' : 'px-8',
    md: isSmall ? 'px-6' : isMedium ? 'px-8' : isTablet ? 'px-12' : 'px-16',
    lg: isSmall ? 'px-8' : isMedium ? 'px-12' : isTablet ? 'px-16' : 'px-24',
  };

  const paddingClass = paddingMap[padding];
  const heightClass = fullHeight ? 'min-h-[calc(100vh-180px)]' : '';

  const containerStyle: CSSProperties = {
    backgroundColor,
    maxWidth: maxWidth || '100%',
    margin: '0 auto',
  };

  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${heightClass}
        ${paddingClass}
        py-6 sm:py-8 md:py-12
        w-full
        ${className}
      `}
      style={containerStyle}
    >
      <div className="w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
});

export default CenteredContainer;
