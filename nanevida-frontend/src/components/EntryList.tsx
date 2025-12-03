import Card from './ui/Card'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'

type Entry = { id:number; title:string; content:string; emoji?:string; mood?:string; created_at:string }
type Props = { 
  items: Entry[];
  onDelete: (id:number) => void;
  onEdit: (entry: Entry) => void;
}

const MOOD_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  very_happy: { emoji: '😊', label: 'Muy feliz', color: 'bg-green-100 text-green-800' },
  happy: { emoji: '🙂', label: 'Feliz', color: 'bg-lime-100 text-lime-800' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
  sad: { emoji: '😢', label: 'Triste', color: 'bg-blue-100 text-blue-800' },
  anxious: { emoji: '😰', label: 'Ansios@', color: 'bg-yellow-100 text-yellow-800' },
  angry: { emoji: '😡', label: 'Enojado/a', color: 'bg-red-100 text-red-800' },
}

export default function EntryList({ items, onDelete, onEdit }: Props){
  if (items.length === 0) {
    return (
      <EmptyState
        icon="📔"
        title="No hay entradas todavía"
        description="Comienza a escribir tu diario emocional. Cada entrada es un paso hacia el autoconocimiento."
      />
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        📖 Tus entradas ({items.length})
      </h3>
      
      {items.map(e => {
        const date = new Date(e.created_at)
        const formattedDate = date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        const formattedTime = date.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        })

        return (
          <Card key={e.id} hover className="transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{e.emoji || '📝'}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {e.title || 'Sin título'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formattedDate} • {formattedTime}
                      </p>
                      {e.mood && MOOD_MAP[e.mood] && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${MOOD_MAP[e.mood].color}`}>
                          <span>{MOOD_MAP[e.mood].emoji}</span>
                          {MOOD_MAP[e.mood].label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {e.content}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(e)}
                  title="Editar entrada"
                >
                  ✏️
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm('¿Estás seguro de eliminar esta entrada?')) {
                      onDelete(e.id)
                    }
                  }}
                  title="Eliminar entrada"
                >
                  🗑️
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
