import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className="
        relative w-14 h-8 rounded-full transition-all duration-300
        bg-gray-200 dark:bg-gray-700
        hover:shadow-medium
        focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-800
        interactive
      "
      aria-label={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
    >
      {/* Toggle slider */}
      <div
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full
          bg-white dark:bg-gray-900
          shadow-soft
          transition-transform duration-300 ease-out
          flex items-center justify-center
          ${isDark ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {/* Icon */}
        {isDark ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-warmth">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-warmth">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
            <path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </button>
  )
}
