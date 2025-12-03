import { useState } from 'react'
import { api, setTokens } from '../api'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import Button from '../components/ui/Button'
import { HeartIcon } from '../assets/icons'

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
      nav('/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'No pudimos conectarte. Revisa tus datos o intenta más tarde.')
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
    <div className="max-w-md mx-auto animate-fadeIn">
      <Card gradient className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <img 
            src="/icons/logo-icon.png" 
            alt="Nane Vida" 
            className="h-20 w-auto"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">
          Nos alegra verte de nuevo
        </h2>
        <p className="text-[#555555] text-base">
          Tu espacio de bienestar te está esperando
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
            <div className="p-4 bg-[#FBCFE8]/20 border border-[#FBCFE8]/40 rounded-2xl">
              <p className="text-[#444444] text-sm">
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

        <div className="mt-6 pt-6 border-t border-[#A78BFA]/20">
          <div className="text-center space-y-3">
            <p className="text-[#555555] text-sm">
              ¿Primera vez aquí?
            </p>
            <Link to="/register">
              <Button variant="success" fullWidth>
                Crear mi cuenta
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
