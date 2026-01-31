/**
 * Trial Messaging - Sistema de awareness post-trial
 * 
 * Maneja mensajes sutiles cuando el trial está cerca de expirar.
 * NO muestra números, NO crea urgencia falsa.
 * Solo refleja realidad: "esta experiencia profunda pronto dejará de estar disponible"
 */

import { isTrialActive, getTrialDaysLeft } from '../config/trial'

const AWARENESS_THRESHOLD_DAYS = 2
const SESSION_KEY = 'nane_trial_ending_soon_seen'

/**
 * Verifica si el trial está por expirar (<=2 días restantes)
 */
export function shouldShowTrialEndingSoon(): boolean {
  if (!isTrialActive()) return false
  
  const daysLeft = getTrialDaysLeft()
  if (daysLeft > AWARENESS_THRESHOLD_DAYS) return false
  
  // Mostrar solo 1 vez por sesión
  const alreadySeen = sessionStorage.getItem(SESSION_KEY)
  if (alreadySeen === 'true') return false
  
  return true
}

/**
 * Marca el awareness como visto en esta sesión
 */
export function markTrialEndingSoonSeen(): void {
  sessionStorage.setItem(SESSION_KEY, 'true')
}

/**
 * Obtiene mensaje calmado sobre trial próximo a expirar
 * SIN números, SIN urgencia, tono reflexivo
 */
export function getTrialEndingSoonMessage(): string {
  const messages = [
    'Esta claridad más profunda pronto dejará de estar disponible.',
    'Si te está sirviendo, puedes mantener este nivel cuando quieras.',
    'El acceso a estas capas más profundas está por completarse.',
    'Este nivel de insight no siempre estará activo.'
  ]
  
  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
}

/**
 * Verifica si el trial ya expiró (para soft lock)
 */
export function isTrialExpired(): boolean {
  const trialStartDate = localStorage.getItem('trial_start_date')
  if (!trialStartDate) return false // Nunca tuvo trial
  
  return !isTrialActive() // Trial existe pero ya no está activo
}
