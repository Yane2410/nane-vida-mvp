/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sistema de colores terapéutico profesional
        primary: {
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
        // Colores emocionales para herramientas
        calm: {
          light: '#E0F2FE',
          DEFAULT: '#7DD3FC',
          dark: '#0369A1',
        },
        energy: {
          light: '#D1FAE5',
          DEFAULT: '#34D399',
          dark: '#047857',
        },
        warmth: {
          light: '#FEF3C7',
          DEFAULT: '#FBBF24',
          dark: '#D97706',
        },
        gentle: {
          light: '#FCE7F3',
          DEFAULT: '#F9A8D4',
          dark: '#DB2777',
        },
        // Neutrales profesionales
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
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
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 8px 30px -6px rgba(0, 0, 0, 0.1), 0 15px 35px -5px rgba(0, 0, 0, 0.08)',
        'strong': '0 20px 40px -12px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.1)',
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
