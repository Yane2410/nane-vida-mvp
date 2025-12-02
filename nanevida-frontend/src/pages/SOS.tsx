import { useEffect, useState } from 'react'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type SOS = { 
  id: number
  title: string
  type: 'CALL' | 'LINK' | 'TEXT'
  url?: string
  priority: number
  active: boolean
}

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

export default function SOSPage() {
  const [list, setList] = useState<SOS[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      setLoading(true)
      const response = await api.get('/sos/')
      const data = response.data.results || response.data
      const items: SOS[] = Array.isArray(data) ? data : []
      setList(items.filter(x => x.active).sort((a, b) => a.priority - b.priority))
      setError('')
    } catch (err) {
      setList([])
      setError('No se pudieron cargar los recursos SOS.')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string, id: number) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const telLabel = isMobile ? 'Llamar' : 'Abrir app de llamadas'

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Cargando recursos..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card gradient className="text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-400/20 to-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 flex items-center justify-center gap-3">
            <span className="text-5xl">🆘</span>
            <span>Ayuda Inmediata</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
            Si estás atravesando una crisis emocional, estos recursos están disponibles para ti las 24 horas del día
          </p>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="text-red-800 font-semibold">{error}</p>
              <Button 
                variant="danger" 
                size="sm" 
                className="mt-3"
                onClick={loadResources}
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {list.length === 0 && !error && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📞</div>
          <p className="text-slate-600 text-lg">
            No hay recursos configurados todavía.
          </p>
        </Card>
      )}

      {/* Resource List */}
      <div className="space-y-4">
        {list.map(resource => {
          const isCall = resource.type === 'CALL' && resource.url?.startsWith('tel:')
          const isLink = resource.type === 'LINK' && resource.url
          const phoneNumber = resource.url?.replace('tel:', '')

          return (
            <Card 
              key={resource.id} 
              hover
              className="relative overflow-hidden"
            >
              {/* Type Badge */}
              <div className="absolute top-4 right-4">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${resource.type === 'CALL' ? 'bg-green-100 text-green-700' : ''}
                  ${resource.type === 'LINK' ? 'bg-blue-100 text-blue-700' : ''}
                  ${resource.type === 'TEXT' ? 'bg-gray-100 text-gray-700' : ''}
                `}>
                  {resource.type === 'CALL' && '📞 Llamada'}
                  {resource.type === 'LINK' && '🔗 Enlace'}
                  {resource.type === 'TEXT' && '📝 Información'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pr-24 sm:pr-28">
                {/* Resource Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                    {resource.type === 'CALL' && <span className="text-2xl">📱</span>}
                    {resource.type === 'LINK' && <span className="text-2xl">🌐</span>}
                    {resource.type === 'TEXT' && <span className="text-2xl">💬</span>}
                    {resource.title}
                  </h3>
                  {isCall && phoneNumber && (
                    <p className="text-lg font-mono text-indigo-600 font-semibold mt-2">
                      {phoneNumber}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {isCall && (
                    <>
                      {!isMobile && phoneNumber && (
                        <Button
                          variant={copiedId === resource.id ? 'success' : 'secondary'}
                          size="md"
                          onClick={() => copyToClipboard(phoneNumber, resource.id)}
                          icon={copiedId === resource.id ? <span>✓</span> : <span>📋</span>}
                        >
                          {copiedId === resource.id ? 'Copiado' : 'Copiar'}
                        </Button>
                      )}
                      <a href={resource.url!}>
                        <Button variant="primary" size="md" icon={<span>📞</span>}>
                          {telLabel}
                        </Button>
                      </a>
                    </>
                  )}

                  {isLink && (
                    <a href={resource.url!} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="md" icon={<span>🔗</span>}>
                        Abrir enlace
                      </Button>
                    </a>
                  )}

                  {!isCall && !isLink && (
                    <span className="text-slate-500 font-medium px-4 py-2">
                      Información disponible
                    </span>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Emergency Notice */}
      {list.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-200/60">
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Aviso Importante
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Si estás experimentando una emergencia médica o psiquiátrica,
                por favor contacta inmediatamente a los servicios de emergencia locales (911 o tu número de emergencia local).
                Estos recursos son de apoyo emocional y no sustituyen la atención médica profesional de emergencia.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

