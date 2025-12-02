import { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'

type SOS = { id:number; title:string; type:'CALL'|'LINK'|'TEXT'; url?:string; priority:number; active:boolean }

export default function Home(){
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const [sos, setSos] = useState<SOS[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sos/')
      .then(r => {
        // El backend devuelve un objeto paginado: {count, next, previous, results}
        const data = r.data.results || r.data
        const items: SOS[] = Array.isArray(data) ? data : []
        const top = items
          .filter(x => x.active)
          .sort((a,b) => a.priority - b.priority)
          .slice(0, 3)
        setSos(top)
      })
      .catch(() => setSos([]))
      .finally(() => setLoading(false))
  }, [])

  async function copy(text: string){
    try { 
      await navigator.clipboard.writeText(text)
      // Opcional: mostrar toast de confirmación
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card gradient className="text-center py-8 px-6">
        <div className="text-6xl mb-4">💚</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Bienvenido a tu espacio seguro
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Un lugar donde puedes expresar tus emociones libremente, encontrar recursos de apoyo y cuidar tu bienestar emocional día a día.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/diary">
            <Button variant="primary" size="lg" fullWidth={false}>
              <span>�</span>
              Escribir en mi diario
            </Button>
          </Link>
          <Link to="/sos">
            <Button variant="secondary" size="lg" fullWidth={false}>
              <span>🆘</span>
              Ver recursos SOS
            </Button>
          </Link>
        </div>
      </Card>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diario Card */}
        <Card hover className="flex flex-col">
          <div className="text-4xl mb-4">📔</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Diario personal
          </h3>
          <p className="text-gray-600 mb-4 flex-1">
            Escribe cómo te sientes cada día. Tu diario es privado y solo tú puedes verlo. Expresar tus emociones es el primer paso hacia el bienestar.
          </p>
          <Link to="/diary" className="mt-auto">
            <Button variant="secondary" fullWidth>
              Ir al Diario →
            </Button>
          </Link>
        </Card>

        {/* Tips Card */}
        <Card className="flex flex-col bg-gradient-to-br from-emerald-50 to-white">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Tips de bienestar
          </h3>
          <ul className="space-y-3 text-gray-600 flex-1">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Respira profundo 3 veces antes de reaccionar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Pequeños logros cuentan: escribe 2 líneas hoy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Conecta con alguien de confianza</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Cada día es una nueva oportunidad</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* SOS Quick Access */}
      <Card className="bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">🆘</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Recursos de ayuda inmediata
            </h3>
            <p className="text-gray-600 text-sm">
              Acceso rápido a líneas de ayuda y recursos de emergencia
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : sos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay recursos configurados todavía.
          </p>
        ) : (
          <div className="space-y-3">
            {sos.map(x => (
              <div 
                key={x.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-red-100"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☎️</span>
                  <span className="font-medium text-gray-800">{x.title}</span>
                </div>

                <div className="flex gap-2">
                  {x.type === 'CALL' && x.url?.startsWith('tel:') && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copy(x.url!.replace('tel:',''))}
                        title="Copiar al portapapeles"
                      >
                        📋 Copiar
                      </Button>
                      <a href={x.url!}>
                        <Button
                          variant="primary"
                          size="sm"
                        >
                          📞 {isMobile ? 'Llamar' : 'Llamar'}
                        </Button>
                      </a>
                    </>
                  )}

                  {x.type === 'LINK' && x.url && (
                    <a
                      href={x.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="sm">
                        🔗 Abrir enlace
                      </Button>
                    </a>
                  )}

                  {x.type === 'TEXT' && (
                    <span className="text-gray-500 text-sm">ℹ️ Información disponible</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <Link to="/sos">
            <Button variant="secondary" fullWidth>
              Ver todos los recursos →
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
