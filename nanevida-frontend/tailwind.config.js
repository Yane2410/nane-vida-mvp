/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#1F2937',
          700: '#374151',
          500: '#6B7280',
        },
        surface: {
          1: '#FFFFFF',
          2: '#FAFAFA',
          3: '#F5F5F5',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        error: {
          DEFAULT: 'var(--error)',
          foreground: 'var(--error-foreground)',
        },
        info: {
          DEFAULT: 'var(--info)',
          foreground: 'var(--info-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Therapeutic color system
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        // Emotional colors for tools
        calm: {
          light: '#E0F2FE',
          DEFAULT: '#7DD3FC',
          dark: '#0369A1',
          foreground: 'var(--calm-foreground)',
        },
        energy: {
          light: '#D1FAE5',
          DEFAULT: '#34D399',
          dark: '#047857',
          foreground: 'var(--energy-foreground)',
        },
        warmth: {
          light: '#FEF3C7',
          DEFAULT: '#FBBF24',
          dark: '#D97706',
          foreground: 'var(--warmth-foreground)',
        },
        gentle: {
          light: '#FCE7F3',
          DEFAULT: '#F9A8D4',
          dark: '#DB2777',
          foreground: 'var(--gentle-foreground)',
        },
        // Neutral grays
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.025em', fontWeight: '600' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '-0.011em' }],
        'body': ['1rem', { lineHeight: '1.625', letterSpacing: '-0.011em' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '-0.006em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        'ds-sm': 'var(--radius-sm)',
        'ds-md': 'var(--radius-md)',
        'ds-lg': 'var(--radius-lg)',
        'ds-xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'medium': 'var(--shadow-medium)',
        'strong': 'var(--shadow-strong)',
        'glow': 'var(--shadow-glow)',
        'card': '0 10px 30px -12px rgba(31, 41, 55, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--primary) 0%, var(--primary-300) 100%)',
        'gradient-calm': 'linear-gradient(135deg, var(--calm) 0%, var(--calm-light) 100%)',
        'gradient-energy': 'linear-gradient(135deg, var(--energy) 0%, var(--energy-light) 100%)',
        'gradient-warmth': 'linear-gradient(135deg, var(--warmth) 0%, var(--warmth-light) 100%)',
        'gradient-gentle': 'linear-gradient(135deg, var(--gentle) 0%, var(--gentle-light) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
