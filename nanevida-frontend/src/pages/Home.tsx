import { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'

type SOS = { id:number; title:string; type:'CALL'|'LINK'|'TEXT'; url?:string; priority:number; active:boolean }

export default function Home(){
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const [sos, setSos] = useState<SOS[]>([])

  useEffect(() => {
    api.get('/sos/')
      .then(r => {
        const items: SOS[] = Array.isArray(r.data) ? r.data : []
        const top = items
          .filter(x => x.active)
          .sort((a,b) => a.priority - b.priority)
          .slice(0, 3)
        setSos(top)
      })
      .catch(() => setSos([]))
  }, [])

  async function copy(text: string){
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  return (
    <div>
      <div className="list">
        <div className="card">
          <strong>💚 Diario personal (requiere inicio de sesión)</strong>
          <p>Escribe cómo te sientes cada día. Solo tú puedes ver y gestionar tus entradas.</p>
          <Link className="btn" to="/diary">Ir al Diario</Link>
        </div>

        <div className="card">
          <strong>🌟 Tips de bienestar</strong>
          <ul style={{margin:'8px 0 0 18px'}}>
            <li>Respira profundo 3 veces antes de reaccionar.</li>
            <li>Pequeños logros cuentan: escribe 2 líneas hoy.</li>
            <li>Conecta con alguien de confianza.</li>
          </ul>
        </div>

        <div className="card">
          <strong>🆘 SOS (vista pública)</strong>
          {sos.length === 0 && <p>No hay recursos configurados todavía.</p>}

          <div className="list">
            {sos.map(x => (
              <div key={x.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
                <span>{x.title}</span>

                {/* Acciones según el tipo */}
                {x.type === 'CALL' && x.url?.startsWith('tel:') && (
                  <div style={{display:'flex', gap:8}}>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => copy(x.url!.replace('tel:',''))}
                      title="Copiar al portapapeles"
                    >
                      Copiar número
                    </button>
                    <a
                      className="btn"
                      href={x.url!}
                      title={isMobile ? 'Llamar' : 'Abrir app de llamadas'}
                    >
                      {isMobile ? 'Llamar' : 'Llamar'}
                    </a>
                  </div>
                )}

                {x.type === 'LINK' && x.url && (
                  <a
                    className="btn"
                    href={x.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir enlace
                  </a>
                )}

                {x.type === 'TEXT' && (
                  <span style={{color:'#64748b'}}>Información disponible</span>
                )}
              </div>
            ))}
          </div>

          <div style={{marginTop:8}}>
            <Link className="btn" to="/sos">Ver todos</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
