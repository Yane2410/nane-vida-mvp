import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { SparkleIcon } from '../assets/icons'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo al escribir
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await api.post('/register/', formData)
      // Registro exitoso, redirigir al login
      nav('/login', { 
        state: { message: '¡Te damos la bienvenida! Ahora puedes iniciar sesión y comenzar tu camino.' } 
      })
    } catch (err: any) {
      if (err?.response?.data) {
        const data = err.response.data
        
        // Errores de campos específicos
        if (typeof data === 'object') {
          const errors: Record<string, string> = {}
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
              errors[key] = data[key][0]
            } else if (typeof data[key] === 'string') {
              errors[key] = data[key]
            }
          })
          setFieldErrors(errors)
        } else {
          setError('No pudimos completar tu registro. Por favor intenta nuevamente.')
        }
      } else {
        setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 animate-fadeIn">
      <Card className="w-full max-w-md" gradient>
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/icons/logo-icon.png" 
              alt="Nane Vida" 
              className="h-20 w-auto rounded-2xl"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
            Empieza tu viaje de bienestar
          </h2>
          <p className="text-slate-800 dark:text-slate-100 text-sm">
            Crea tu cuenta y encuentra tu espacio seguro
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-[#FBCFE8]/20 border border-[#FBCFE8]/40 rounded-2xl text-slate-900 dark:text-white text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="username"
              placeholder="Nombre de usuario *"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {fieldErrors.username && (
              <p className="text-[#EC4899] text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <Input
              type="email"
              name="email"
              placeholder="Correo electrónico *"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-[#EC4899] text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="text"
                name="first_name"
                placeholder="Nombre"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="text"
                name="last_name"
                placeholder="Apellido"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Input
              type="password"
              name="password"
              placeholder="Contraseña *"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {fieldErrors.password && (
              <p className="text-[#EC4899] text-sm mt-1">{fieldErrors.password}</p>
            )}
            <p className="text-[#888888] text-xs mt-1">
              Mínimo 8 caracteres, con letras y números
            </p>
          </div>

          <div>
            <Input
              type="password"
              name="password2"
              placeholder="Confirmar contraseña *"
              value={formData.password2}
              onChange={handleChange}
              required
              disabled={loading}
            />
            {fieldErrors.password2 && (
              <p className="text-[#EC4899] text-sm mt-1">{fieldErrors.password2}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            {loading ? 'Creando tu cuenta...' : 'Crear mi cuenta'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#A78BFA]/20">
          <div className="text-center space-y-3">
            <p className="text-slate-800 dark:text-slate-100 text-sm">
              ¿Ya tienes una cuenta?
            </p>
            <Link to="/login">
              <Button variant="secondary" fullWidth>
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
