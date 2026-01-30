import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken, logout } from './api'
import Button from './components/ui/Button'
import MobileMenu from './components/ui/MobileMenu'
import ThemeToggle from './components/ui/ThemeToggle'
import OnboardingModal from './components/ui/OnboardingModal'
import MilestoneModal from './components/MilestoneModal'
import FloatingSOSButton from './components/ui/FloatingSOSButton'
import BottomNav from './components/ui/BottomNav'
import { smoothNavigate } from './utils/navigation'

export default function App(){
  const nav = useNavigate()
  const isAuth = !!getToken()
  const loc = useLocation()
  const showLoginBtn = !isAuth && loc.pathname !== '/login'

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    // 🔐 SECURITY: Limpiar tokens y cache sensible de forma selectiva
    await logout() // Server revoke + local cleanup
    sessionStorage.clear() // Limpia profile_cache y otros datos temporales
    localStorage.removeItem('nane_username') // Cleanup username para shared computers
    
    smoothNavigate(() => nav('/'))
  }

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden text-foreground">
      {/* Header */}
      <header className="safe-top sticky top-0 z-50 border-b border-white/40 bg-white/80 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-gray-700/40 dark:bg-gray-900/70">
        <div className="safe-x max-w-4xl mx-auto w-full py-2 md:py-3">
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
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/garden">
                    <Button variant="ghost" size="sm">
                      Jardin
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button variant="ghost" size="sm">
                      Diario
                    </Button>
                  </Link>
                </>
              )}
              {!isAuth && (
                <>
                  <Link to="/">
                    <Button variant="ghost" size="sm">
                      Inicio
                    </Button>
                  </Link>
                  <Link to="/diary">
                    <Button variant="ghost" size="sm">
                      Diario
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/sos">
                <Button variant="secondary" size="sm">
                  SOS
                </Button>
              </Link>
              {!isAuth ? (
                <>
                  <Link to="/login">
                    <Button variant="primary" size="sm">
                      Iniciar sesion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="success" size="sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Settings visible en desktop */}
                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Configuracion"
                      aria-label="Configuracion"
                    >
                      Configuracion
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Salir
                  </Button>
                </>
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
      <main className="safe-x app-scroll flex-1 min-h-0 w-full max-w-4xl mx-auto py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-8">
        <Outlet/>
      </main>

      <BottomNav isAuth={isAuth} />

      {/* ⚠️ ONBOARDING: Solo se muestra cuando se activa manualmente desde Settings */}
      {/* NO se auto-inicia en el flujo principal (ver OnboardingContext) */}
      <OnboardingModal />

      {/* Milestone Modal */}
      <MilestoneModal />

      {/* Floating SOS Button - Always visible on mobile */}
      <FloatingSOSButton />

      {/* Footer */}
      <footer className="hidden md:block border-t border-white/40 bg-white/60 shadow-inner backdrop-blur-xl">
        <div className="safe-x max-w-4xl mx-auto w-full py-6">
          <p className="text-center text-sm text-black dark:text-white font-medium">
            (c) {new Date().getFullYear()} NANE VIDA - Cuidando tu bienestar emocional
          </p>
        </div>
      </footer>
    </div>
  )
}
