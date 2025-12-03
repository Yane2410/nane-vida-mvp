// Responsiveness update – custom hook for window dimensions
import { useState, useEffect } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isTablet: boolean;
}

export function useWindowDimensions(): WindowDimensions {
  const [dimensions, setDimensions] = useState<WindowDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmall: window.innerWidth < 640,
    isMedium: window.innerWidth >= 640 && window.innerWidth < 1024,
    isLarge: window.innerWidth >= 1024,
    isTablet: window.innerWidth >= 768,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({
        width,
        height,
        isSmall: width < 640,
        isMedium: width >= 640 && width < 1024,
        isLarge: width >= 1024,
        isTablet: width >= 768,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
