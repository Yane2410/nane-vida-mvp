import { Link } from 'react-router-dom'

export default function FloatingSOSButton() {
  return (
    <Link 
      to="/sos"
      className="fixed bottom-6 right-6 z-50 md:hidden group"
      aria-label="Botón SOS de emergencia"
    >
      <div className="relative">
        {/* Pulse animation ring */}
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        
        {/* Button */}
        <button className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95">
          <span className="text-2xl font-bold">🆘</span>
        </button>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Ayuda de emergencia
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </Link>
  )
}
