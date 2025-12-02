import { useState } from 'react'
import { api, setTokens } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent){
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { data } = await api.post('/token/', { username, password })
      setTokens(data.access, data.refresh)
      nav('/diary')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Credenciales inválidas o servidor caído.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUsername('')
    setPassword('')
    setError('')
  }

  return (
    <div className="max-w-md mx-auto">
      <Card gradient className="text-center mb-6">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Iniciar sesión
        </h2>
        <p className="text-gray-600">
          Accede a tu diario personal y comienza a escribir
        </p>
      </Card>

      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Usuario"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            placeholder="tu_usuario"
            icon={<span>👤</span>}
            required
            disabled={loading}
          />

          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<span>🔒</span>}
            required
            disabled={loading}
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              icon={<span>🚀</span>}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link
              to="/register"
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
