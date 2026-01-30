import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import MoodSelector, { Mood } from '../components/ui/MoodSelector'
import EmotionalCard from '../components/ui/EmotionalCard'
import { getToken } from '../api'
import {
  BreathIcon,
  CalmIcon,
  JournalIcon,
  HeartIcon,
  FlowerIcon,
  CloudIcon,
} from '../assets/icons'

export default function Home() {
  const isAuthenticated = !!getToken()
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>()

  return (
    <div className="min-h-screen py-10 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        <section className="space-y-6">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-primary-100/70 text-primary-700">
              Espacio seguro
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 dark:text-white">
              Tu espacio de bienestar emocional, sin juicio y a tu ritmo
            </h1>
            <p className="text-base sm:text-lg text-ink-700 dark:text-gray-200 max-w-xl">
              Un lugar para reconocer lo que sientes, escribir con calma y volver a ti cuando lo necesitas.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="primary" size="md">
                      Ir a mi espacio
                    </Button>
                  </Link>
                  <Link to="/sos">
                    <Button variant="danger" size="md">
                      Necesito ayuda ahora
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" size="md">
                      Crear mi cuenta
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="md">
                      Iniciar sesion
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="text-xs text-ink-500 dark:text-gray-300">
              Tus datos son privados y no se comparten con terceros.
            </p>
          </div>

        </section>

        <Card gradient animated className="shadow-card">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white mb-3">
              Como te sientes hoy?
            </h2>
            <p className="text-base sm:text-lg text-ink-700 dark:text-gray-200 max-w-xl mx-auto">
              Toma un momento para nombrar tu estado. No hay respuestas correctas o incorrectas.
            </p>
          </div>

          <MoodSelector value={selectedMood} onChange={setSelectedMood} />

          {selectedMood && (
            <div className="mt-6 text-center">
              {isAuthenticated ? (
                <Link to="/diary">
                  <Button variant="primary" size="lg" icon={<JournalIcon />}>
                    Escribir en mi diario
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={<HeartIcon />}>
                    Comenzar mi camino
                  </Button>
                </Link>
              )}
            </div>
          )}
        </Card>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 dark:text-white">
              Herramientas para tu bienestar
            </h2>
            <p className="text-sm text-ink-600 dark:text-gray-300">
              Elige lo que necesitas ahora mismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmotionalCard
              title="Calma rapida"
              description="Tecnicas de 5 minutos para encontrar paz en momentos intensos."
              icon={<CloudIcon size={32} />}
              color="#7DD3FC"
              href="/calm"
            />

            <EmotionalCard
              title="Ejercicio de respiracion"
              description="Guias de respiracion consciente para volver al centro."
              icon={<BreathIcon size={32} />}
              color="#A78BFA"
              href="/breath"
            />

            <EmotionalCard
              title="Reflexion guiada"
              description="Preguntas suaves para conocerte mejor, sin prisa."
              icon={<FlowerIcon size={32} />}
              color="#FBCFE8"
              href="/reflection"
            />

            <EmotionalCard
              title="Tecnicas de grounding"
              description="Vuelve al presente cuando te sientas abrumado o desconectado."
              icon={<CalmIcon size={32} />}
              color="#BBF7D0"
              href="/grounding"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: 'Privado y seguro',
              description: 'Tu diario es solo tuyo. Protegemos tu informacion.',
            },
            {
              title: 'Sin juicio',
              description: 'Un espacio amable para expresar lo que sientes.',
            },
            {
              title: 'A tu ritmo',
              description: 'Avanza cuando quieras, como quieras.',
            },
          ].map((card) => (
            <Card key={card.title} className="text-center shadow-card">
              <h4 className="font-semibold text-ink-900 dark:text-white mb-2">{card.title}</h4>
              <p className="text-sm text-ink-600 dark:text-gray-200">{card.description}</p>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}
