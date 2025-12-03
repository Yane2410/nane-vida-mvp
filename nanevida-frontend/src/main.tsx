import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { ReminderProvider } from './contexts/ReminderContext'
import { GardenProvider } from './contexts/GardenContext'
import App from './App'
import LoadingSpinner from './components/ui/LoadingSpinner'
import RequireAuth from './components/RequireAuth'
import './styles.css'

// Lazy load all route components for better performance
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Diary = lazy(() => import('./pages/Diary'))
const Statistics = lazy(() => import('./pages/Statistics'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))
const SOS = lazy(() => import('./pages/SOS'))
const Calm = lazy(() => import('./pages/Calm'))
const Breath = lazy(() => import('./pages/Breath'))
const Reflection = lazy(() => import('./pages/Reflection'))
const Grounding = lazy(() => import('./pages/Grounding'))
const Garden = lazy(() => import('./pages/Garden'))

// Suspense wrapper component
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  }>
    {children}
  </Suspense>
)

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <SuspenseWrapper><Home/></SuspenseWrapper> },
    { path: 'login', element: <SuspenseWrapper><Login/></SuspenseWrapper> },
    { path: 'register', element: <SuspenseWrapper><Register/></SuspenseWrapper> },
    { path: 'dashboard', element: <SuspenseWrapper><RequireAuth><Dashboard/></RequireAuth></SuspenseWrapper> },
    { path: 'diary', element: <SuspenseWrapper><RequireAuth><Diary/></RequireAuth></SuspenseWrapper> },
    { path: 'statistics', element: <SuspenseWrapper><RequireAuth><Statistics/></RequireAuth></SuspenseWrapper> },
    { path: 'garden', element: <SuspenseWrapper><RequireAuth><Garden/></RequireAuth></SuspenseWrapper> },
    { path: 'settings', element: <SuspenseWrapper><RequireAuth><Settings/></RequireAuth></SuspenseWrapper> },
    { path: 'profile', element: <SuspenseWrapper><RequireAuth><Profile/></RequireAuth></SuspenseWrapper> },
    { path: 'sos', element: <SuspenseWrapper><SOS/></SuspenseWrapper> },
    { path: 'calm', element: <SuspenseWrapper><Calm/></SuspenseWrapper> },
    { path: 'breath', element: <SuspenseWrapper><Breath/></SuspenseWrapper> },
    { path: 'reflection', element: <SuspenseWrapper><Reflection/></SuspenseWrapper> },
    { path: 'grounding', element: <SuspenseWrapper><Grounding/></SuspenseWrapper> }
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <ReminderProvider>
          <OnboardingProvider>
            <GardenProvider>
              <RouterProvider router={router} />
            </GardenProvider>
          </OnboardingProvider>
        </ReminderProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope)
        
        // Check for updates every hour
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, just log it (no auto-reload)
                console.log('🎉 Nueva versión disponible del Service Worker')
              }
            })
          }
        })
      })
      .catch((error) => {
        console.warn('⚠️ Service Worker registration failed:', error)
      })
  })
  
  // Reload page when new service worker takes control
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true
      window.location.reload()
    }
  })
}

// PWA Install prompt
let deferredPrompt: any = null

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault()
  // Stash the event so it can be triggered later
  deferredPrompt = e
  
  // Show custom install button (could add this to Settings page)
  console.log('💡 PWA install prompt available')
})

window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully')
  deferredPrompt = null
})

// Export function to trigger install prompt
;(window as any).showInstallPrompt = function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt')
      }
      deferredPrompt = null
    })
  }
}
