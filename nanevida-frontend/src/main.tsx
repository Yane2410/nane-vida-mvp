import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider } from './contexts/OnboardingContext'
import { ReminderProvider } from './contexts/ReminderContext'
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
            <RouterProvider router={router} />
          </OnboardingProvider>
        </ReminderProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
