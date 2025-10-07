import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { getToken } from './api'

export default function App(){
  const nav = useNavigate()
  const isAuth = !!getToken()
  const loc = useLocation()
  const showLoginBtn = !isAuth && loc.pathname !== '/login'

  return (
    <div className="container">
      <header className="brand">
        <h1 className="brand__title">NANE VIDA</h1>
        <p className="brand__subtitle">Bienestar emocional con simplicidad y respeto — versión MVP</p>
        <nav>
          <Link className="btn" to="/">Inicio</Link>
          <Link className="btn" to="/diary">Diario</Link>
          <Link className="btn" to="/sos">SOS</Link>
          {showLoginBtn && <Link className="btn btn--primary" to="/login">Iniciar sesión</Link>}
          {isAuth && <a className="btn btn--ghost" href="#" onClick={(e)=>{e.preventDefault(); localStorage.clear(); nav('/')}}>Salir</a>}
          <a className="btn btn--link" href="https://example.com" target="_blank" rel="noreferrer">Ayuda</a>
        </nav>
      </header>
      <main className="section">
        <Outlet/>
      </main>
      <footer className="small">© {new Date().getFullYear()} NANE VIDA — MVP educativo</footer>
    </div>
  )
}
