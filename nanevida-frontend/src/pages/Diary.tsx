import { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'

type Entry = { id:number; title:string; content:string; emoji?:string; created_at:string }

export default function Diary(){
  const [items, setItems] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const nav = useNavigate()

  async function load(){
    try{
      const { data } = await api.get('/entries/')
      // El backend devuelve un objeto paginado: {count, next, previous, results}
      const entries = data.results || data
      setItems(Array.isArray(entries) ? entries : [])
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('Error al cargar tu diario. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function save(entry:{title:string;content:string;emoji?:string}){
    setSaving(true)
    try{
      const { data } = await api.post('/entries/', entry)
      setItems([data, ...items])
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('Error al guardar la entrada. Por favor intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function del(id:number){
    try{
      await api.delete(`/entries/${id}/`)
      setItems(items.filter(i=>i.id!==id))
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No se pudo eliminar la entrada.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span>📔</span>
          Mi Diario Emocional
        </h2>
        <p className="text-gray-600">
          Un espacio privado para expresar tus emociones y reflexionar
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {/* Entry Form */}
      {saving ? (
        <Card gradient className="mb-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Guardando tu entrada...</p>
        </Card>
      ) : (
        <EntryForm onSave={save}/>
      )}

      {/* Entries List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <EntryList items={items} onDelete={del}/>
      )}
    </div>
  )
}
