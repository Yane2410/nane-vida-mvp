import { Link, useLocation } from 'react-router-dom'
import {
  JournalIcon,
  FlowerIcon,
  HeartIcon,
  SparkleIcon,
  CalmIcon,
} from '../../assets/icons'

type NavItem = {
  label: string
  to: string
  icon: JSX.Element
}

const authedItems: NavItem[] = [
  { label: 'Inicio', to: '/dashboard', icon: <SparkleIcon size={20} color="currentColor" /> },
  { label: 'Diario', to: '/diary', icon: <JournalIcon size={20} color="currentColor" /> },
  { label: 'Jardin', to: '/garden', icon: <FlowerIcon size={20} color="currentColor" /> },
  { label: 'SOS', to: '/sos', icon: <HeartIcon size={20} color="currentColor" /> },
  { label: 'Ajustes', to: '/settings', icon: <CalmIcon size={20} color="currentColor" /> },
]

const guestItems: NavItem[] = [
  { label: 'Inicio', to: '/', icon: <SparkleIcon size={20} color="currentColor" /> },
  { label: 'Diario', to: '/diary', icon: <JournalIcon size={20} color="currentColor" /> },
  { label: 'SOS', to: '/sos', icon: <HeartIcon size={20} color="currentColor" /> },
  { label: 'Entrar', to: '/login', icon: <CalmIcon size={20} color="currentColor" /> },
]

export default function BottomNav({ isAuth }: { isAuth: boolean }) {
  const location = useLocation()
  const items = isAuth ? authedItems : guestItems
  const gridCols = items.length === 4 ? 'grid-cols-4' : 'grid-cols-5'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[90] md:hidden">
      <div className="safe-x">
        <div className="mx-auto w-full max-w-3xl rounded-t-2xl border border-white/50 bg-white/80 shadow-strong backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/70">
          <div className={`grid ${gridCols} gap-1 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]`}>
            {items.map((item) => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-200'
                      : 'text-ink-500 dark:text-gray-300'
                  }`}
                >
                  <span className={isActive ? 'text-primary-600 dark:text-primary-200' : 'text-ink-400 dark:text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
