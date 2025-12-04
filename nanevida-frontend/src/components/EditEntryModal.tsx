import { useState, useEffect } from 'react';
import { Input, Textarea } from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

type Entry = {
  id: number;
  title: string;
  content: string;
  emoji?: string;
  mood?: string;
};

type Props = {
  entry: Entry;
  onSave: (id: number, data: { title: string; content: string; emoji?: string; mood?: string }) => void;
  onCancel: () => void;
};

const EMOJIS = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😢', label: 'Triste' },
  { emoji: '😡', label: 'Enojado' },
  { emoji: '😰', label: 'Ansios@' },
  { emoji: '😴', label: 'Cansad@' },
  { emoji: '🤩', label: 'Emocionado' },
  { emoji: '😌', label: 'Tranquilo' },
  { emoji: '🥰', label: 'Agradecido' },
];

const MOODS = [
  { value: 'very_happy', emoji: '😊', label: 'Muy feliz' },
  { value: 'happy', emoji: '🙂', label: 'Feliz' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😢', label: 'Triste' },
  { value: 'anxious', emoji: '😰', label: 'Ansios@' },
  { value: 'angry', emoji: '😡', label: 'Enojado/a' },
];

export default function EditEntryModal({ entry, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [emoji, setEmoji] = useState(entry.emoji || '😊');
  const [mood, setMood] = useState(entry.mood || '');
  const [error, setError] = useState('');

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Por favor escribe algo en el contenido');
      return;
    }

    onSave(entry.id, { title, content, emoji, mood });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="max-w-2xl w-full my-8">
        <Card gradient className="animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>✏️</span>
              Editar entrada
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100 text-2xl leading-none"
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Cómo estuvo tu día?"
              icon={<span>📝</span>}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📊 ¿Cómo describirías tu estado de ánimo?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOODS.map(({ value, emoji: e, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMood(value)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                      mood === value
                        ? 'bg-emerald-100 ring-2 ring-emerald-500 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{e}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" size="lg" fullWidth icon={<span>💾</span>}>
                Guardar cambios
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onCancel}
                icon={<span>✕</span>}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
