/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        'primary-light': '#a78bfa',
        'primary-dark': '#7c3aed',
        secondary: '#34d399',
        'secondary-light': '#6ee7b7',
        'secondary-dark': '#10b981',
        accent: '#facc15',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
