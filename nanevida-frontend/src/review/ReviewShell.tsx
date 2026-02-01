import { ReactNode, useEffect, MouseEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { clearReviewGate } from '../security/reviewMode'

const navItems = [
  { to: '/review/dashboard', label: 'Dashboard' },
  { to: '/review/diary', label: 'Diario' },
  { to: '/review/garden', label: 'Jardin' },
  { to: '/review/calm', label: 'Calma' },
  { to: '/review/breath', label: 'Respirar' },
  { to: '/review/reflection', label: 'Reflexion' },
  { to: '/review/grounding', label: 'Grounding' },
  { to: '/review/sos', label: 'SOS' },
  { to: '/review/settings', label: 'Ajustes' },
]

export default function ReviewShell({ children }: { children: ReactNode }) {
  const nav = useNavigate()

  useEffect(() => {
    if (typeof document === 'undefined') return
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null
    const shouldCleanup = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'robots')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', 'noindex,nofollow')
    return () => {
      if (shouldCleanup && meta?.parentNode) {
        meta.parentNode.removeChild(meta)
      }
    }
  }, [])

  const handleExit = () => {
    clearReviewGate()
    nav('/', { replace: true })
  }

  const handleLinkCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    if (!target) return
    const anchor = target.closest('a') as HTMLAnchorElement | null
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href || !href.startsWith('/')) return
    if (href.startsWith('/review')) return
    event.preventDefault()
    const next = href === '/' ? '/review/dashboard' : `/review${href}`
    nav(next)
  }

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-background text-foreground">
      <header className="safe-top sticky top-0 z-50 border-b border-border/60 bg-card/80 shadow-lg backdrop-blur-xl">
        <div className="safe-x max-w-5xl mx-auto w-full py-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                Review Mode - Mock Data
              </span>
              <span className="text-xs text-muted-foreground">No production backend</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              aria-label="Salir de Review Mode"
              title="Salir"
            >
              Salir
            </Button>
          </div>
          <nav className="mt-3 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        className="safe-x app-scroll flex-1 min-h-0 w-full max-w-5xl mx-auto py-6 pb-[calc(5rem+env(safe-area-inset-bottom))]"
        onClick={handleLinkCapture}
      >
        {children}
      </main>
    </div>
  )
}
