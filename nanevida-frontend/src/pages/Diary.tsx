import { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useGarden } from '../contexts/GardenContext'
import EntryForm from '../components/EntryForm'
import EntryList from '../components/EntryList'
import EditEntryModal from '../components/EditEntryModal'
import MoodChart from '../components/MoodChart'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { JournalIcon } from '../assets/icons'
import ActivityCompletionModal from '../components/ActivityCompletionModal'

type Entry = { id:number; title:string; content:string; emoji?:string; mood?:string; created_at:string }

export default function Diary(){
  const [items, setItems] = useState<Entry[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const nav = useNavigate()
  const toast = useToast()
  const { plantSeed } = useGarden()

  async function load(){
    try{
      const { data } = await api.get('/entries/')
      // El backend devuelve un objeto paginado: {count, next, previous, results}
      const entries = data.results || data
      setItems(Array.isArray(entries) ? entries : [])
      setError('')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No pudimos cargar tus entradas. Por favor verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function save(entry:{title:string;content:string;emoji?:string;mood?:string}){
    setSaving(true)
    try{
      const { data } = await api.post('/entries/', entry)
      setItems([data, ...items])
      setError('')
      toast.success('Entrada guardada exitosamente')
      
      // Plant seed after saving diary entry
      try {
        await plantSeed('diary', 0); // Diary doesn't track duration
        setShowCompletionModal(true);
      } catch (error) {
        console.error('Error planting seed:', error);
      }
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No pudimos guardar tu entrada. Intenta nuevamente.')
      toast.error('Error al guardar la entrada')
    } finally {
      setSaving(false)
    }
  }

  async function del(id:number){
    try{
      await api.delete(`/entries/${id}/`)
      setItems(items.filter(i=>i.id!==id))
      setError('')
      toast.info('Entrada eliminada')
    }catch(e:any){
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No pudimos eliminar la entrada.')
      toast.error('Error al eliminar')
    }
  }

  function handleEdit(entry: Entry) {
    setEditingEntry(entry);
  }

  async function handleSaveEdit(id: number, data: {title:string;content:string;emoji?:string;mood?:string}) {
    setSaving(true);
    try {
      const { data: updated } = await api.put(`/entries/${id}/`, data);
      setItems(items.map(i => i.id === id ? updated : i));
      setEditingEntry(null);
      setError('');
      toast.success('Entrada actualizada');
    } catch(e: any) {
      if (e?.response?.status === 401) { nav('/login'); return }
      setError('No pudimos actualizar la entrada.')
      toast.error('Error al actualizar')
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditingEntry(null);
  }

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <Card gradient className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-[#A78BFA]/20">
          <JournalIcon size={32} color="#A78BFA" />
        </div>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
          Mi Diario Personal
        </h2>
        <p className="text-black dark:text-white">
          Este es tu espacio seguro para expresarte libremente
        </p>
      </Card>

      {/* Stats Toggle Button */}
      <div className="mb-6 flex justify-center">
        <Button
          variant={showStats ? 'secondary' : 'primary'}
          size="md"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? 'Ver Diario' : 'Ver Estadísticas'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="mb-6 bg-[#FBCFE8]/20 border-[#FBCFE8]/40">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Show Stats or Diary */}
      {showStats ? (
        <MoodChart />
      ) : (
        <>
          {/* Entry Form */}
          {saving ? (
            <Card gradient className="mb-8 text-center">
              <LoadingSpinner />
              <p className="text-black dark:text-white mt-4">Guardando tu entrada...</p>
            </Card>
          ) : (
            <EntryForm onSave={save}/>
          )}

          {/* Entries List */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <EntryList items={items} onDelete={del} onEdit={handleEdit}/>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Activity Completion Modal */}
      <ActivityCompletionModal
        isOpen={showCompletionModal}
        activityName="Entrada de Diario"
        activityIcon="🌹"
        plantName="Rosa de Autoconocimiento"
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  )
}
