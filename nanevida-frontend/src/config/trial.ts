/**
 * Trial Premium State (localStorage only)
 * 
 * Trial inicia automáticamente al primer login/registro.
 * 7 días de acceso completo a features premium.
 * Sin backend, sin pagos, sin fricción.
 */

export const TRIAL_DAYS = 7
const AWARENESS_THRESHOLD_DAYS = 2 // Mostrar awareness últimos 2 días

const STORAGE_KEY = 'trial_start_date'
const SESSION_MESSAGE_KEY = 'trial_welcome_shown'
const AWARENESS_MESSAGE_KEY = 'trial_awareness_shown'

/**
 * Inicia trial automáticamente (registro o primer login)
 */
export function startTrial(): void {
  const existing = localStorage.getItem(STORAGE_KEY)
  
  if (!existing) {
    const now = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, now)
  }
}

/**
 * Verifica si trial está activo
 */
export function isTrialActive(): boolean {
  const startDate = localStorage.getItem(STORAGE_KEY)
  
  if (!startDate) return false
  
  const start = new Date(startDate).getTime()
  const now = Date.now()
  const elapsed = now - start
  const trialDuration = TRIAL_DAYS * 24 * 60 * 60 * 1000
  
  return elapsed < trialDuration
}

/**
 * Obtiene días restantes de trial
 */
export function getTrialDaysLeft(): number {
  const startDate = localStorage.getItem(STORAGE_KEY)
  
  if (!startDate) return 0
  
  const start = new Date(startDate).getTime()
  const now = Date.now()
  const elapsed = now - start
  const trialDuration = TRIAL_DAYS * 24 * 60 * 60 * 1000
  const remaining = trialDuration - elapsed
  
  if (remaining <= 0) return 0
  
  return Math.ceil(remaining / (24 * 60 * 60 * 1000))
}

/**
 * Verifica si debe mostrar mensaje de bienvenida al trial (una vez por sesión)
 */
export function shouldShowTrialWelcome(): boolean {
  if (!isTrialActive()) return false
  
  return sessionStorage.getItem(SESSION_MESSAGE_KEY) !== 'true'
}

/**
 * Marca mensaje de bienvenida como mostrado
 */
export function markTrialWelcomeShown(): void {
  sessionStorage.setItem(SESSION_MESSAGE_KEY, 'true')
}

/**
 * Verifica si trial expiró
 */
export function isTrialExpired(): boolean {
  const startDate = localStorage.getItem(STORAGE_KEY)
  
  if (!startDate) return false
  
  return !isTrialActive()
}

/**
 * Verifica si trial está cercano a expirar (últimos 2 días)
 */
export function isTrialExpiringSoon(): boolean {
  if (!isTrialActive()) return false
  
  const daysLeft = getTrialDaysLeft()
  return daysLeft <= AWARENESS_THRESHOLD_DAYS && daysLeft > 0
}

/**
 * Verifica si debe mostrar mensaje de awareness (una vez por sesión)
 */
export function shouldShowTrialAwareness(): boolean {
  if (!isTrialExpiringSoon()) return false
  
  return sessionStorage.getItem(AWARENESS_MESSAGE_KEY) !== 'true'
}

/**
 * Marca mensaje de awareness como mostrado
 */
export function markTrialAwarenessShown(): void {
  sessionStorage.setItem(AWARENESS_MESSAGE_KEY, 'true')
}
