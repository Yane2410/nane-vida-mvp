import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './api'
import Button from './components/ui/Button'
import MobileMenu from './components/ui/MobileMenu'
import ThemeToggle from './components/ui/ThemeToggle'
import OnboardingModal from './components/ui/OnboardingModal'
import MilestoneModal from './components/MilestoneModal'

export default function App(){
  const nav = useNavigate()
  const isAuth = !!getToken()
  const loc = useLocation()
  const showLoginBtn = !isAuth && loc.pathname !== '/login'

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.clear()
    nav('/')
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border-b border-white/40 dark:border-gray-700/40 shadow-lg sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          {/* Top Bar - Logo + Theme Toggle + Mobile Menu */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            {/* Brand */}
            <div className="text-left flex items-center gap-3">
              <img 
                src="/icons/logo-full.png" 
                alt="Nane Vida" 
                className="h-10 md:h-12 lg:h-14 w-auto"
              />
            </div>

            {/* Theme Toggle + Mobile Menu */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <MobileMenu isAuth={isAuth} onLogout={handleLogout} />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap gap-2 justify-center sm:justify-start">
            <Link to="/">
              <Button variant="secondary" size="md">
                <span>🏠</span>
                Inicio
              </Button>
            </Link>
            {isAuth && (
              <Link to="/dashboard">
                <Button variant="primary" size="md">
                  <span>📊</span>
                  Dashboard
                </Button>
              </Link>
            )}
            {isAuth && (
              <Link to="/garden">
                <Button variant="secondary" size="md">
                  <span>🌱</span>
                  Jardín
                </Button>
              </Link>
            )}
            <Link to="/diary">
              <Button variant="secondary" size="md">
                <span>📔</span>
                Diario
              </Button>
            </Link>
            {isAuth && (
              <>
                <Link to="/statistics">
                  <Button variant="secondary" size="md">
                    <span>📊</span>
                    Estadísticas
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="secondary" size="md">
                    <span>👤</span>
                    Perfil
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="secondary" size="md">
                    <span>⚙️</span>
                    Configuración
                  </Button>
                </Link>
              </>
            )}
            <Link to="/sos">
              <Button variant="secondary" size="md">
                <span>🆘</span>
                SOS
              </Button>
            </Link>
            {!isAuth && (
              <>
                <Link to="/login">
                  <Button variant="primary" size="md">
                    <span>🔐</span>
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="success" size="md">
                    <span>✨</span>
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
            {isAuth && (
              <Button variant="ghost" size="md" onClick={handleLogout}>
                <span>👋</span>
                Salir
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet/>
      </main>

      {/* Onboarding Modal */}
      <OnboardingModal />

      {/* Milestone Modal */}
      <MilestoneModal />

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/60 border-t border-white/40 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600 font-medium">
            © {new Date().getFullYear()} NANE VIDA — Cuidando tu bienestar emocional 💜
          </p>
          <p className="text-center text-sm text-[#A78BFA] font-medium mt-2" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>
            Con amor para mi Yane ❤️
          </p>
        </div>
      </footer>
    </div>
  )
}
