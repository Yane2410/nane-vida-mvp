import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './api'
import Button from './components/ui/Button'
import MobileMenu from './components/ui/MobileMenu'
import ThemeToggle from './components/ui/ThemeToggle'
import OnboardingModal from './components/ui/OnboardingModal'
import MilestoneModal from './components/MilestoneModal'
import FloatingSOSButton from './components/ui/FloatingSOSButton'

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3">
          {/* Top Bar - Logo + Theme Toggle + Mobile Menu */}
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link to="/" className="text-left flex items-center">
              <img 
                src="/icons/logo-full.png" 
                alt="Nane Vida" 
                className="h-8 md:h-10 w-auto rounded-xl md:rounded-2xl"
              />
            </Link>

            {/* Desktop Navigation - Only essential items */}
            <nav className="hidden md:flex items-center gap-2">
              {isAuth && (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      📊 Dashboard
                    </Button>
                  </Link>
                  <Link to="/garden">
                    <Button variant="ghost" size="sm">
                      🌱 Jardín
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button variant="ghost" size="sm">
                      📔 Diario
                    </Button>
                  </Link>
                </>
              )}
              {!isAuth && (
                <>
                  <Link to="/">
                    <Button variant="ghost" size="sm">
                      🏠 Inicio
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button variant="ghost" size="sm">
                      📔 Diario
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/sos">
                <Button variant="secondary" size="sm">
                  🆘 SOS
                </Button>
              </Link>
              {!isAuth ? (
                <>
                  <Link to="/login">
                    <Button variant="primary" size="sm">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="success" size="sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  👋 Salir
                </Button>
              )}
            </nav>

            {/* Theme Toggle + Mobile Menu */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <MobileMenu isAuth={isAuth} onLogout={handleLogout} />
            </div>
          </div>
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

      {/* Floating SOS Button - Always visible on mobile */}
      <FloatingSOSButton />

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-white/60 border-t border-white/40 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-black dark:text-white font-medium">
            © {new Date().getFullYear()} NANE VIDA — Cuidando tu bienestar emocional 💜
          </p>
        </div>
      </footer>
    </div>
  )
}
