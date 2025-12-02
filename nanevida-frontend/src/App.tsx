import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './api'
import Button from './components/ui/Button'

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-br from-purple-50 via-white to-emerald-50 border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Brand */}
          <div className="text-center sm:text-left mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-emerald-500 bg-clip-text text-transparent mb-2">
              NANE VIDA
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Bienestar emocional con simplicidad y respeto
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
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
            <Link to="/diary">
              <Button variant="secondary" size="md">
                <span>📔</span>
                Diario
              </Button>
            </Link>
            {isAuth && (
              <Link to="/profile">
                <Button variant="secondary" size="md">
                  <span>👤</span>
                  Perfil
                </Button>
              </Link>
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet/>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NANE VIDA — Cuidando tu bienestar emocional
          </p>
        </div>
      </footer>
    </div>
  )
}
