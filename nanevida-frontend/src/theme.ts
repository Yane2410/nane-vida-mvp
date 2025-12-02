// 🎨 Sistema de diseño emocional para NANE VIDA

export const theme = {
  // Paleta emocional - Modo claro
  colors: {
    // Fondos
    background: {
      primary: '#F7F5FF',      // Lavanda muy suave
      white: '#FDFCFB',        // Blanco cálido
      card: '#FFFFFF',         // Blanco puro para cards
    },
    
    // Colores principales
    primary: {
      main: '#A78BFA',         // Lila relajante
      light: '#C4B5FD',        // Lila más claro
      dark: '#8B5CF6',         // Lila más oscuro
    },
    
    secondary: {
      main: '#7DD3FC',         // Celeste suave
      light: '#BAE6FD',        // Celeste muy claro
      dark: '#38BDF8',         // Celeste más oscuro
    },
    
    // Tonos de apoyo
    support: {
      pink: '#FBCFE8',         // Rosa pastel
      green: '#BBF7D0',        // Verde suave
      yellow: '#FEF3C7',       // Amarillo suave
      orange: '#FED7AA',       // Naranja suave
    },
    
    // Textos
    text: {
      primary: '#333333',      // Texto principal
      secondary: '#555555',    // Texto secundario
      tertiary: '#777777',     // Texto terciario
      white: '#FFFFFF',        // Texto blanco
    },
    
    // Estados
    states: {
      success: '#BBF7D0',
      warning: '#FEF3C7',
      error: '#FECACA',
      info: '#BFDBFE',
    },
  },
  
  // Modo oscuro
  darkMode: {
    background: {
      primary: '#1F1B2E',
      secondary: '#2A2638',
      card: '#352F44',
    },
    primary: '#C4B5FD',
    text: {
      primary: '#EEEEEE',
      secondary: '#CCCCCC',
    },
  },
  
  // Tipografía
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: {
      xs: '14px',
      sm: '16px',
      md: '18px',
      lg: '20px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '40px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  
  // Espaciado
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // Bordes
  borderRadius: {
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    full: '9999px',
  },
  
  // Sombras suaves
  shadows: {
    sm: '0 2px 8px rgba(167, 139, 250, 0.08)',
    md: '0 4px 16px rgba(167, 139, 250, 0.12)',
    lg: '0 8px 24px rgba(167, 139, 250, 0.16)',
    xl: '0 12px 32px rgba(167, 139, 250, 0.20)',
  },
  
  // Transiciones
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
}

export type Theme = typeof theme
