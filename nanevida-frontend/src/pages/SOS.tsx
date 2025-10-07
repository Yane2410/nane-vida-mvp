import { useEffect, useState } from 'react'
import { api } from '../api'

type SOS = { id:number; title:string; type:'CALL'|'LINK'|'TEXT'; url?:string; priority:number; active:boolean }

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

export default function SOSPage(){
  const [list, setList] = useState<SOS[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/sos/')
      .then(r => {
        const items: SOS[] = Array.isArray(r.data) ? r.data : []
        setList(items.filter(x => x.active).sort((a,b)=> a.priority - b.priority))
        setError('')
      })
      .catch(() => { setList([]); setError('No se pudieron cargar los recursos SOS.') })
  }, [])

  const copy = async (text:string) => {
    try { await navigator.clipboard.writeText(text) } catch {}
  }

  const telLabel = isMobile ? 'Llamar' : 'Abrir app de llamadas'

  return (
    <div>
      <h2>SOS emocional</h2>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      {list.length === 0 && !error && <p>No hay recursos configurados todavía.</p>}

      <div className="list">
        {list.map(x => {
          const isCall = x.type === 'CALL' && x.url?.startsWith('tel:')
          const isLink = x.type === 'LINK' && x.url

          return (
            <div key={x.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
              <div>
                <strong>{x.title}</strong>{' '}
                <span style={{color:'#64748b'}}>({x.type})</span>
                {isCall && <div style={{fontSize:14, color:'#475569', marginTop:4}}>
                  {x.url!.replace('tel:','')}
                </div>}
              </div>

              <div style={{display:'flex', gap:8}}>
                {isCall && (
                  <>
                    {!isMobile && (
                      <button className="btn btn--primary" onClick={()=>copy(x.url!.replace('tel:',''))}>
                        Copiar número
                      </button>
                    )}
                    <a className="btn" href={x.url!}>{telLabel}</a>
                  </>
                )}

                {isLink && (
                  <a className="btn" href={x.url!} target="_blank" rel="noopener noreferrer">
                    Abrir enlace
                  </a>
                )}

                {!isCall && !isLink && (
                  <span style={{color:'#64748b'}}>Información disponible</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
