import { FormEvent, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import ReviewShell from './ReviewShell'
import {
  isReviewEnabled,
  isReviewGateRequired,
  isReviewGateSatisfied,
  isReviewRoute,
  setReviewGateSatisfied,
} from '../security/reviewMode'

export default function ReviewGate() {
  const location = useLocation()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  if (!isReviewEnabled() || !isReviewRoute(location.pathname)) {
    return <Navigate to="/" replace />
  }

  if (!isReviewGateRequired() || isReviewGateSatisfied()) {
    return (
      <ReviewShell>
        <Outlet />
      </ReviewShell>
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const ok = setReviewGateSatisfied(token.trim())
    if (!ok) {
      setError('Token incorrecto. Intenta nuevamente.')
      return
    }
    setError('')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nv-review-ready'))
    }
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background text-foreground safe-x">
      <Card className="w-full max-w-md shadow-card">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Review Mode</p>
            <h1 className="text-2xl font-semibold text-foreground">Acceso restringido</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Ingresa el token para habilitar la vista de revision.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Review gate token"
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Token"
              autoComplete="off"
              error={error || undefined}
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              Entrar en Review Mode
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
