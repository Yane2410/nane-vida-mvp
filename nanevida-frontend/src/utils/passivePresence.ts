/**
 * Notificaciones "Aquí estoy" (Presencia Pasiva Inteligente)
 * 
 * Psicología: Seguridad emocional + baja ansiedad
 * 
 * CONDICIONES:
 * - Usuario no ha escrito en X días (mínimo 4 días)
 * - No mostrar si usuario activo (escribió hoy/ayer)
 * - 1 mensaje cada 3 días máximo
 * - Sin CTA, sin sonido, sin animación llamativa
 * 
 * Usa localStorage para tracking de última entrada y último mensaje mostrado
 */

const PRESENCE_MESSAGES = [
  'Si hoy necesitas un momento, aquí sigo.',
  'No tienes que decir mucho. Con que estés aquí, basta.',
  'Tu espacio sigue siendo tuyo.',
  'No hay prisa por volver. Cuando estés lista, aquí estoy.',
  'A veces alejarse también es necesario. Este lugar te espera.',
  'Tomarte tiempo no significa que estés perdiendo nada.'
]

const DAYS_BETWEEN_MESSAGES = 3 // Cada 3 días máximo
const DAYS_WITHOUT_WRITING = 4 // Mostrar solo si lleva 4+ días sin escribir

/**
 * Verifica si debe mostrarse el mensaje de presencia pasiva
 * 
 * Condiciones:
 * 1. Usuario no ha escrito en los últimos DAYS_WITHOUT_WRITING días
 * 2. No se ha mostrado mensaje en los últimos DAYS_BETWEEN_MESSAGES días
 * 3. Usuario no está activo (no escribió hoy/ayer)
 */
export function shouldShowPassivePresence(): boolean {
  const lastEntryDate = localStorage.getItem('last_entry_date')
  const lastMessageShown = localStorage.getItem('passive_presence_last_shown')
  
  // Si no hay registro de última entrada, no mostrar
  if (!lastEntryDate) {
    return false
  }
  
  // Verificar días desde última entrada
  const lastEntry = new Date(lastEntryDate)
  const now = new Date()
  const daysSinceLastEntry = Math.floor((now.getTime() - lastEntry.getTime()) / (24 * 60 * 60 * 1000))
  
  // Usuario activo (escribió recientemente), no mostrar
  if (daysSinceLastEntry < DAYS_WITHOUT_WRITING) {
    return false
  }
  
  // Verificar si ya se mostró mensaje recientemente
  if (lastMessageShown) {
    const lastShown = new Date(lastMessageShown)
    const daysSinceMessage = Math.floor((now.getTime() - lastShown.getTime()) / (24 * 60 * 60 * 1000))
    
    if (daysSinceMessage < DAYS_BETWEEN_MESSAGES) {
      return false
    }
  }
  
  return true
}

/**
 * Obtiene mensaje de presencia pasiva si aplica
 * 
 * @returns Mensaje string o null si no debe mostrarse
 */
export function getPassivePresenceMessage(): string | null {
  if (!shouldShowPassivePresence()) {
    return null
  }
  
  // Marcar como mostrado
  localStorage.setItem('passive_presence_last_shown', new Date().toISOString())
  
  // Seleccionar mensaje basado en número de días desde epoch (rotativo determinista)
  const daysSinceEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
  const index = daysSinceEpoch % PRESENCE_MESSAGES.length
  
  return PRESENCE_MESSAGES[index]
}

/**
 * Registra que el usuario escribió una entrada (actualiza last_entry_date)
 * Llamar después de guardar entrada en diario
 */
export function recordEntryWritten(): void {
  localStorage.setItem('last_entry_date', new Date().toISOString())
}

/**
 * Descarta el mensaje actual (no se volverá a mostrar hasta que pasen DAYS_BETWEEN_MESSAGES)
 */
export function dismissPassivePresence(): void {
  localStorage.setItem('passive_presence_last_shown', new Date().toISOString())
}
