import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'

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
        state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' } 
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
          setError('Error al registrar usuario')
        }
      } else {
        setError('Error de conexión. Por favor intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Crear cuenta
          </h2>
          <p className="text-gray-600 text-sm">
            Únete a NANE VIDA y comienza tu viaje de bienestar emocional
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
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
              <p className="text-red-600 text-sm mt-1">{fieldErrors.username}</p>
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
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
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
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
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
              <p className="text-red-600 text-sm mt-1">{fieldErrors.password2}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link
              to="/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}
