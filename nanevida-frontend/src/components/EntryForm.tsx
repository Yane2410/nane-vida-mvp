import { useState } from 'react'
import { Input, Textarea } from './ui/Input'
import Button from './ui/Button'
import Card from './ui/Card'

type Props = { onSave: (data:{title:string;content:string;emoji?:string})=>void }

const EMOJIS = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😡', label: 'Enojado' },
  { emoji: '😰', label: 'Ansioso' },
  { emoji: '😴', label: 'Cansado' },
  { emoji: '🤩', label: 'Emocionado' },
  { emoji: '😌', label: 'Tranquilo' },
  { emoji: '🥰', label: 'Agradecido' },
]

export default function EntryForm({ onSave }: Props){
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emoji, setEmoji] = useState('�')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if(!content.trim()){
      setError('Por favor escribe algo en el contenido')
      return
    }
    
    onSave({title, content, emoji})
    setTitle('')
    setContent('')
    setEmoji('😊')
    setError('')
  }

  return (
    <Card gradient className="mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>✍️</span>
        Nueva entrada
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Título (opcional)"
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          placeholder="¿Cómo estuvo tu día?"
          icon={<span>📝</span>}
        />
        
        <Textarea 
          label="¿Cómo te sientes?"
          rows={5} 
          value={content} 
          onChange={e=>setContent(e.target.value)} 
          placeholder="Expresa tus emociones libremente... Este es tu espacio seguro."
          error={error}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ¿Cómo describirías tu emoción?
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {EMOJIS.map(({ emoji: e, label }) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`p-3 rounded-xl text-3xl transition-all duration-200 hover:scale-110 ${
                  emoji === e 
                    ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                title={label}
                aria-label={label}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          fullWidth
          icon={<span>💾</span>}
        >
          Guardar en mi diario
        </Button>
      </form>
    </Card>
  )
}
