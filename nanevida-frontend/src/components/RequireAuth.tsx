import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../adapters/auth/authAdapter'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const loc = useLocation()
  const authed = isAuthenticated(loc.pathname)
  if (!authed) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  }
  return children
}
