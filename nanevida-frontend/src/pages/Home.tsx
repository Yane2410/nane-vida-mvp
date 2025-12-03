import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import MoodSelector, { Mood } from '../components/ui/MoodSelector'
import EmotionalCard from '../components/ui/EmotionalCard'
import AppHeader from '../components/ui/AppHeader'
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
    <div className="min-h-screen py-8 space-y-8 animate-fadeIn">
      <AppHeader />

      <Card gradient animated>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            ¿Cómo te sientes hoy?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
            Está bien tomarte un momento para reconocer tus emociones.
            No hay respuestas correctas o incorrectas.
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

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Herramientas para tu bienestar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmotionalCard
            title="Calma Rápida"
            description="Técnicas de 5 minutos para encontrar paz en momentos difíciles. Respira, todo estará bien."
            icon={<CloudIcon size={32} />}
            color="#7DD3FC"
            href="/calm"
          />

          <EmotionalCard
            title="Ejercicio de Respiración"
            description="Guías de respiración consciente para reducir la ansiedad y conectar contigo."
            icon={<BreathIcon size={32} />}
            color="#A78BFA"
            href="/breath"
          />

          <EmotionalCard
            title="Reflexión Guiada"
            description="Preguntas suaves para explorar tus pensamientos y emociones con cuidado."
            icon={<FlowerIcon size={32} />}
            color="#FBCFE8"
            href="/reflection"
          />

          <EmotionalCard
            title="Técnicas de Grounding"
            description="Ejercicios para volver al presente cuando te sientas abrumado o desconectado."
            icon={<CalmIcon size={32} />}
            color="#BBF7D0"
            href="/grounding"
          />
        </div>
      </div>

      <Card className="text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-[#FBCFE8]/30">
            <HeartIcon size={28} color="#EC4899" />
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-[#333333] mb-3">
            No estás solo en esto
          </h3>
          
          <p className="text-base sm:text-lg text-[#444444] leading-relaxed mb-6">
            Cuidar tu salud mental es un acto de valentía y amor propio.
            Cada paso que das, por pequeño que sea, es importante.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    Iniciar sesión
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}></div>
          <h4 className="font-bold text-[#333333] mb-2">Privado y Seguro</h4>
          <p className="text-sm text-[#555555]">
            Tus pensamientos son solo tuyos. Mantenemos tu información segura y privada.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}></div>
          <h4 className="font-bold text-[#333333] mb-2">Sin Juicios</h4>
          <p className="text-sm text-[#555555]">
            Este es un espacio seguro para expresarte libremente, sin miedo ni vergüenza.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-3" style={{ filter: 'contrast(1.2) saturate(1.3)' }}></div>
          <h4 className="font-bold text-[#333333] mb-2">A Tu Ritmo</h4>
          <p className="text-sm text-[#555555]">
            No hay prisas. Avanza a tu propio paso, cuando te sientas listo.
          </p>
        </Card>
      </div>
    </div>
  )
}
