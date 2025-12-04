import { useState } from 'react';
import { Input, Textarea } from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

type Props = { 
  onSave: (data: {
    title: string;
    content: string;
    emoji?: string;
    mood?: string;
  }) => void;
};

const EMOJIS = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😠', label: 'Enojado' },
  { emoji: '😰', label: 'Ansios@' },
  { emoji: '😴', label: 'Cansad@' },
  { emoji: '🤩', label: 'Emocionado' },
  { emoji: '😌', label: 'Tranquilo' },
  { emoji: '🙏', label: 'Agradecido' },
];

const MOODS = [
  { value: 'very_happy', emoji: '😄', label: 'Muy feliz' },
  { value: 'happy', emoji: '😊', label: 'Feliz' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😢', label: 'Triste' },
  { value: 'anxious', emoji: '😰', label: 'Ansios@' },
  { value: 'angry', emoji: '😠', label: 'Enojado/a' },
];

export default function EntryForm({ onSave }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('');
  const [mood, setMood] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor escribe algo en el contenido');
      return;
    }
    
    onSave({ title, content, emoji, mood });
    setTitle('');
    setContent('');
    setEmoji('');
    setMood('');
    setError('');
  };

  return (
    <Card gradient className="mb-8">
      <h3 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
        <span></span>
        Nueva entrada
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          label="Título (opcional)"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="¿Cómo estuvo tu día?"
          icon={<span></span>}
        />
        
        <Textarea 
          label="¿Cómo te sientes?"
          rows={5} 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Expresa tus emociones libremente... Este es tu espacio seguro."
          error={error}
        />

        {/* Selector de Estado de Ánimo */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
            💭 ¿Cómo describirías tu estado de ánimo hoy?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOODS.map(({ value, emoji: e, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value)}
                className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-105 ${mood === value ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{e}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
                </div>
              </button>
            ))}
          </div>
          {!mood && (
            <p className="text-xs text-slate-700 dark:text-slate-200 mt-2">
               Opcional: Esto nos ayudará a mostrarte estadísticas de tu estado de ánimo
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
            ✨ ¿Cómo describirías tu emoción?
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {EMOJIS.map(({ emoji: e, label }) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`p-3 rounded-xl text-3xl transition-all duration-200 hover:scale-110 ${emoji === e ? 'bg-purple-100 ring-2 ring-purple-500 scale-110' : 'bg-gray-50 hover:bg-gray-100'}`}
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
          icon={<span></span>}
        >
          Guardar en mi diario
        </Button>
      </form>
    </Card>
  );
}
