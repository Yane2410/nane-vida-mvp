import { useEffect, useState } from 'react'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { HeartIcon } from '../assets/icons'

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
      setError('No pudimos cargar los recursos. Por favor intenta de nuevo.')
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <Card gradient className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[#EC4899]/20">
          <HeartIcon size={32} color="#EC4899" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-3">
          Recursos de Apoyo
        </h1>
        <p className="text-slate-900 dark:text-white text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          No estás solo. Estos recursos están disponibles para acompañarte cuando los necesites, las 24 horas del día.
        </p>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="bg-[#FBCFE8]/20 border-[#FBCFE8]/40">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1">
              <p className="text-slate-900 dark:text-white font-medium">{error}</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={loadResources}
            >
              Reintentar
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {list.length === 0 && !error && (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📞</div>
          <p className="text-slate-800 dark:text-slate-100 text-lg">
            No hay recursos configurados en este momento.
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
                  ${resource.type === 'CALL' ? 'bg-[#BBF7D0]/40 text-[#22C55E]' : ''}
                  ${resource.type === 'LINK' ? 'bg-[#7DD3FC]/40 text-[#0284C7]' : ''}
                  ${resource.type === 'TEXT' ? 'bg-[#E9D5FF]/40 text-[#A78BFA]' : ''}
                `}>
                  {resource.type === 'CALL' && '📞 Llamada'}
                  {resource.type === 'LINK' && '🔗 Enlace'}
                  {resource.type === 'TEXT' && '📝 Info'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center pr-24 sm:pr-28">
                {/* Resource Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-1 flex items-center gap-2">
                    {resource.type === 'CALL' && <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>📱</span>}
                    {resource.type === 'LINK' && <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🌐</span>}
                    {resource.type === 'TEXT' && <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💬</span>}
                    {resource.title}
                  </h3>
                  {isCall && phoneNumber && (
                    <p className="text-lg font-mono text-[#A78BFA] font-semibold mt-2">
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
                        >
                          {copiedId === resource.id ? '✓ Copiado' : 'Copiar'}
                        </Button>
                      )}
                      <a href={resource.url!}>
                        <Button variant="primary" size="md">
                          {telLabel}
                        </Button>
                      </a>
                    </>
                  )}

                  {isLink && (
                    <a href={resource.url!} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="md">
                        Abrir enlace
                      </Button>
                    </a>
                  )}

                  {!isCall && !isLink && (
                    <span className="text-[#888888] font-medium px-4 py-2">
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
        <Card className="bg-gradient-to-r from-[#FED7AA]/30 to-[#FBCFE8]/30 border-[#FED7AA]/40">
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>⚠️</span>
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                Aviso importante
              </h3>
              <p className="text-slate-900 dark:text-white leading-relaxed">
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

