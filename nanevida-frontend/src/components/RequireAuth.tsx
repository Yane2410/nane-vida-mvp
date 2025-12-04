import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../api'

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getToken()
  const loc = useLocation()
  if (!token) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />
  }
  return children
}
