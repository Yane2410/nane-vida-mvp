/**
 * dailyPresence
 * 
 * Micro-presencia emocional.
 * Sin agresividad. Sin engagement forzado.
 */

const DAILY_MESSAGES = [
  'Aquí estoy, por si hoy lo necesitas.',
  'Un espacio tranquilo también es avanzar.',
  'No tienes que hacerlo todo hoy.',
  'Respira. Ya estás haciendo lo mejor que puedes.',
  'Tu proceso tiene su propio ritmo.',
  'Está bien tomarte un respiro.',
  'Este momento también cuenta.'
]

/**
 * Obtener mensaje diario (uno por día)
 */
export function getDailyPresenceMessage(): string | null {
  const today = new Date().toDateString()
  const lastShown = localStorage.getItem('daily_presence_last_shown')
  
  if (lastShown === today) {
    return null // Ya mostrado hoy
  }
  
  // Guardar fecha
  localStorage.setItem('daily_presence_last_shown', today)
  
  // Elegir mensaje basado en día del año (consistente por día)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const index = dayOfYear % DAILY_MESSAGES.length
  
  return DAILY_MESSAGES[index]
}
