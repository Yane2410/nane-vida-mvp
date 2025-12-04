import { Link } from 'react-router-dom'

export default function FloatingSOSButton() {
  return (
    <Link 
      to="/sos"
      className="fixed bottom-6 right-6 z-[100] block md:hidden group"
      aria-label="Botón SOS de emergencia"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="relative">
        {/* Subtle pulse animation ring - only on hover/active */}
        <div className="absolute inset-0 bg-red-400 rounded-full opacity-0 group-hover:opacity-50 group-hover:animate-ping transition-opacity"></div>
        
        {/* Button - More subtle design */}
        <button 
          type="button"
          className="relative flex items-center justify-center w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="text-2xl font-bold">🆘</span>
        </button>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
          Ayuda de emergencia
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900 dark:border-t-white"></div>
        </div>
      </div>
    </Link>
  )
}
