import Card from './ui/Card'
import Button from './ui/Button'
import EmptyState from './ui/EmptyState'

type Entry = { id:number; title:string; content:string; emoji?:string; created_at:string }
type Props = { items: Entry[], onDelete:(id:number)=>void }

export default function EntryList({ items, onDelete }: Props){
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
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {e.title || 'Sin título'}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formattedDate} • {formattedTime}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {e.content}
                </p>
              </div>
              
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
          </Card>
        )
      })}
    </div>
  )
}
