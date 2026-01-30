import { Link } from 'react-router-dom'

export default function FloatingSOSButton() {
  return (
    <Link 
      to="/sos"
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-[100] block md:hidden group"
      aria-label="Boton SOS de emergencia"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="relative">
        {/* Subtle pulse animation ring - only on hover/active */}
        <div className="absolute inset-0 rounded-full bg-red-400/40 opacity-0 transition-opacity group-hover:opacity-50 group-hover:animate-ping"></div>
        
        {/* Button - More subtle design */}
        <button 
          type="button"
          className="pressable relative flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
        >
          <span className="text-xs font-semibold tracking-wide">SOS</span>
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
