import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { FlowerIcon, SparkleIcon } from '../assets/icons';

interface ReflectionPrompt {
  id: number;
  category: string;
  question: string;
  subtitle: string;
  color: string;
}

interface SavedReflection {
  id: string;
  question: string;
  answer: string;
  date: string;
}

const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: 1,
    category: 'Emociones',
    question: '¿Qué emoción estás sintiendo en este momento?',
    subtitle: 'No hay respuestas correctas o incorrectas, solo tu verdad',
    color: '#FBCFE8'
  },
  {
    id: 2,
    category: 'Cuerpo',
    question: '¿Dónde sientes esta emoción en tu cuerpo?',
    subtitle: 'Observa las sensaciones físicas sin juzgarlas',
    color: '#A78BFA'
  },
  {
    id: 3,
    category: 'Necesidades',
    question: '¿Qué necesitas en este momento para sentirte mejor?',
    subtitle: 'Puede ser algo simple o algo más profundo',
    color: '#7DD3FC'
  },
  {
    id: 4,
    category: 'Gratitud',
    question: '¿Qué tres cosas agradeces hoy, por pequeñas que sean?',
    subtitle: 'La gratitud transforma nuestra perspectiva',
    color: '#BBF7D0'
  },
  {
    id: 5,
    category: 'Logros',
    question: '¿Qué lograste hoy que te haga sentir orgulloso?',
    subtitle: 'Celebra incluso las victorias más pequeñas',
    color: '#FED7AA'
  },
  {
    id: 6,
    category: 'Autocuidado',
    question: '¿Qué acto de autocuidado puedes hacer por ti mismo hoy?',
    subtitle: 'Cuidarte no es egoísta, es necesario',
    color: '#FBCFE8'
  },
  {
    id: 7,
    category: 'Fortalezas',
    question: '¿Qué fortaleza tuya te ayudó a superar un desafío reciente?',
    subtitle: 'Reconoce tu resiliencia y capacidad',
    color: '#A78BFA'
  },
  {
    id: 8,
    category: 'Presente',
    question: '¿Qué está sucediendo a tu alrededor en este preciso momento?',
    subtitle: 'Practica estar presente con lo que es',
    color: '#7DD3FC'
  }
];

export default function Reflection() {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<ReflectionPrompt | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved reflections from localStorage
    const saved = localStorage.getItem('nane_reflections');
    if (saved) {
      try {
        setSavedReflections(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading reflections:', error);
      }
    }
  }, []);

  const saveReflection = () => {
    if (!selectedPrompt || !reflectionText.trim()) return;

    setIsSaving(true);

    const newReflection: SavedReflection = {
      id: Date.now().toString(),
      question: selectedPrompt.question,
      answer: reflectionText,
      date: new Date().toISOString()
    };

    const updated = [newReflection, ...savedReflections];
    setSavedReflections(updated);
    localStorage.setItem('nane_reflections', JSON.stringify(updated));

    // Show success animation
    setTimeout(() => {
      setIsSaving(false);
      setReflectionText('');
      setSelectedPrompt(null);
    }, 800);
  };

  const deleteReflection = (id: string) => {
    const updated = savedReflections.filter((r) => r.id !== id);
    setSavedReflections(updated);
    localStorage.setItem('nane_reflections', JSON.stringify(updated));
  };

  const selectRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * reflectionPrompts.length);
    setSelectedPrompt(reflectionPrompts[randomIndex]);
    setReflectionText('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showSaved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 animate-fadeIn">
        <div className="max-w-4xl mx-auto">
          <Card
            className="mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.1) 0%, rgba(251, 207, 232, 0.05) 100%)',
              border: '1px solid rgba(251, 207, 232, 0.3)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBCFE8]/20 flex items-center justify-center">
                  <SparkleIcon size={24} color="#EC4899" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#333333]">
                    Mis Reflexiones
                  </h1>
                  <p className="text-[#555555]">
                    {savedReflections.length} reflexión{savedReflections.length !== 1 ? 'es' : ''} guardada{savedReflections.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowSaved(false)}
                variant="secondary"
              >
                Volver
              </Button>
            </div>
          </Card>

          {savedReflections.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>
                🌸
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">
                Aún no hay reflexiones
              </h3>
              <p className="text-[#555555] mb-6">
                Empieza tu práctica de reflexión y tus pensamientos aparecerán aquí
              </p>
              <Button
                onClick={() => setShowSaved(false)}
                variant="primary"
              >
                Crear reflexión
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedReflections.map((reflection) => (
                <Card key={reflection.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-sm text-[#888888] mb-2">
                        {formatDate(reflection.date)}
                      </p>
                      <h3 className="text-lg font-bold text-[#333333] mb-3">
                        {reflection.question}
                      </h3>
                      <p className="text-[#555555] whitespace-pre-wrap leading-relaxed">
                        {reflection.answer}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReflection(reflection.id)}
                      className="text-[#EC4899] hover:text-[#DB2777] transition-colors p-2"
                      title="Eliminar reflexión"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 animate-fadeIn">
        <div className="max-w-3xl mx-auto">
          <Card
            className="mb-6"
            style={{
              background: `linear-gradient(135deg, ${selectedPrompt.color}20 0%, ${selectedPrompt.color}10 100%)`,
              border: `1px solid ${selectedPrompt.color}40`
            }}
          >
            <div className="text-center">
              <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-white/50 text-[#555555] mb-4">
                {selectedPrompt.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-3">
                {selectedPrompt.question}
              </h2>
              <p className="text-[#555555]">
                {selectedPrompt.subtitle}
              </p>
            </div>
          </Card>

          <Card className="mb-6">
            <label className="block text-sm font-medium text-[#444444] mb-3">
              Tu reflexión
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Escribe libremente lo que sientes, piensas o necesitas expresar..."
              className="w-full min-h-[300px] p-4 border-2 border-[#A78BFA]/20 rounded-2xl focus:border-[#A78BFA] focus:ring-4 focus:ring-[#A78BFA]/20 outline-none transition-all resize-none text-[#333333]"
              style={{ fontSize: '16px', lineHeight: '1.6' }}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-[#888888]">
                {reflectionText.length} caracteres
              </span>
              {reflectionText.length > 0 && (
                <span className="text-sm text-[#22C55E]">
                  ✓ Muy bien, sigue escribiendo
                </span>
              )}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={saveReflection}
              disabled={!reflectionText.trim() || isSaving}
              variant="primary"
              size="lg"
              fullWidth
            >
              {isSaving ? '✓ Guardado' : 'Guardar reflexión'}
            </Button>
            <Button
              onClick={() => {
                setSelectedPrompt(null);
                setReflectionText('');
              }}
              variant="secondary"
              size="lg"
            >
              Cancelar
            </Button>
          </div>

          {isSaving && (
            <Card
              className="mt-6 animate-fadeIn"
              style={{
                background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.2) 0%, rgba(187, 247, 208, 0.1) 100%)',
                border: '1px solid rgba(187, 247, 208, 0.4)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>✨</span>
                <p className="text-[#555555]">
                  Tu reflexión ha sido guardada. Gracias por tomarte este tiempo para ti.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F5FF] via-white to-[#E0F2FE] p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card
          className="mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.1) 0%, rgba(251, 207, 232, 0.05) 100%)',
            border: '1px solid rgba(251, 207, 232, 0.3)'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#FBCFE8]/20 flex items-center justify-center">
              <FlowerIcon size={32} color="#EC4899" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#333333] mb-2">
                Reflexión Guiada
              </h1>
              <p className="text-[#555555] text-lg">
                Tómate un momento para conectar contigo. Elige una pregunta o deja que el azar te guíe.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div
            className="cursor-pointer"
            onClick={selectRandomPrompt}
          >
            <Card
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, rgba(167, 139, 250, 0.05) 100%)'
              }}
            >
              <div className="text-center py-4">
                <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>
                  🎲
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-1">
                  Pregunta al azar
                </h3>
                <p className="text-sm text-[#555555]">
                  Deja que la intuición te guíe
                </p>
              </div>
            </Card>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => setShowSaved(true)}
          >
            <Card
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
              style={{
                background: 'linear-gradient(135deg, rgba(125, 211, 252, 0.1) 0%, rgba(125, 211, 252, 0.05) 100%)'
              }}
            >
              <div className="text-center py-4">
                <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>
                  📖
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-1">
                  Mis reflexiones
                </h3>
                <p className="text-sm text-[#555555]">
                  {savedReflections.length} guardada{savedReflections.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Prompts Grid */}
        <h2 className="text-xl font-bold text-[#333333] mb-4">
          Elige una pregunta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reflectionPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="cursor-pointer"
              onClick={() => setSelectedPrompt(prompt)}
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${prompt.color}30` }}
                  >
                    <FlowerIcon size={20} color={prompt.color} />
                  </div>
                  <div className="flex-1">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2"
                      style={{
                        backgroundColor: `${prompt.color}20`,
                        color: '#555555'
                      }}
                    >
                      {prompt.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#333333] mb-1">
                      {prompt.question}
                    </h3>
                    <p className="text-sm text-[#555555]">
                      {prompt.subtitle}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <Card
          className="mt-8"
          style={{
            background: 'linear-gradient(135deg, rgba(187, 247, 208, 0.2) 0%, rgba(187, 247, 208, 0.1) 100%)',
            border: '1px solid rgba(187, 247, 208, 0.4)'
          }}
        >
          <h3 className="text-lg font-bold text-[#333333] mb-3 flex items-center gap-2">
            <span style={{ filter: 'contrast(1.2) saturate(1.3)' }}>💚</span>
            Beneficios de la reflexión
          </h3>
          <p className="text-[#555555] text-sm">
            La escritura reflexiva te ayuda a procesar emociones, ganar claridad sobre situaciones difíciles, 
            y conectar más profundamente contigo mismo. No hay respuestas correctas o incorrectas, 
            solo tu experiencia única y válida.
          </p>
        </Card>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            size="lg"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
