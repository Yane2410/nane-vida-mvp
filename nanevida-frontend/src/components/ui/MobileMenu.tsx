import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

interface MobileMenuProps {
  isAuth: boolean
  onLogout: (e: React.MouseEvent) => void
}

export default function MobileMenu({ isAuth, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
        aria-label="Menú"
      >
        <svg
          className="w-6 h-6 text-slate-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Menú</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={closeMenu}>
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <span>🏠</span>
                  Inicio
                </Button>
              </Link>

              {isAuth && (
                <Link to="/dashboard" onClick={closeMenu}>
                  <Button variant="primary" size="md" className="w-full justify-start">
                    <span>📊</span>
                    Dashboard
                  </Button>
                </Link>
              )}

              <Link to="/diary" onClick={closeMenu}>
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <span>📔</span>
                  Diario
                </Button>
              </Link>

              {isAuth && (
                <>
                  <Link to="/statistics" onClick={closeMenu}>
                    <Button variant="secondary" size="md" className="w-full justify-start">
                      <span>📈</span>
                      Estadísticas
                    </Button>
                  </Link>

                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="secondary" size="md" className="w-full justify-start">
                      <span>👤</span>
                      Perfil
                    </Button>
                  </Link>

                  <Link to="/settings" onClick={closeMenu}>
                    <Button variant="secondary" size="md" className="w-full justify-start">
                      <span>⚙️</span>
                      Configuración
                    </Button>
                  </Link>
                </>
              )}

              <Link to="/sos" onClick={closeMenu}>
                <Button variant="secondary" size="md" className="w-full justify-start">
                  <span>🆘</span>
                  SOS
                </Button>
              </Link>

              {!isAuth && (
                <>
                  <div className="border-t border-slate-200 my-2" />
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="primary" size="md" className="w-full justify-start">
                      <span>🔐</span>
                      Iniciar sesión
                    </Button>
                  </Link>

                  <Link to="/register" onClick={closeMenu}>
                    <Button variant="success" size="md" className="w-full justify-start">
                      <span>✨</span>
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}

              {isAuth && (
                <>
                  <div className="border-t border-slate-200 my-2" />
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={(e) => {
                      onLogout(e)
                      closeMenu()
                    }}
                    className="w-full justify-start"
                  >
                    <span>👋</span>
                    Salir
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
