/**
 * Feature Control - Sistema de features FREE vs PREMIUM
 * 
 * ESTADO ACTUAL: Trial automático al primer login (7 días)
 * FUTURO: Integración con plan de usuario desde backend
 * 
 * ═══════════════════════════════════════════════════════════════
 * PREMIUM STRATEGY - MONETIZATION ROADMAP
 * ═══════════════════════════════════════════════════════════════
 * 
 * USER STATES:
 * - FREE: Funcionalidad base, sin límites artificiales
 * - TRIAL (7 días): Full access para descubrir valor
 * - PREMIUM: Acceso completo pagado
 * - TRIAL_EXPIRED: Regreso a FREE con memoria del valor
 * 
 * TRIAL EXPERIENCE (7 días):
 * 
 * Día 1-2: DESCUBRIMIENTO
 *   → advanced_stats: "Mira patrones que no veías"
 *   → mood_insights: "Tu ánimo tiene ritmo"
 *   → garden_decorations: "Cada logro cuenta"
 * 
 * Día 3-5: VALOR EMOCIONAL
 *   → extended_history: "Tu viaje completo, sin límites"
 *   → data_export: "Tu información, tu control"
 *   → custom_themes: "Hazlo tuyo"
 * 
 * Día 6-7: DEPENDENCIA Y HÁBITO
 *   → Mostrar uso: "Has usado X insights en 7 días"
 *   → Mostrar progreso: "Tu racha de X días merece protección"
 *   → Mensaje calmado: "Continúa tu viaje"
 * 
 * ═══════════════════════════════════════════════════════════════
 * FEATURE CLASSIFICATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * CORE PREMIUM (convierte):
 * - advanced_stats: Gráficos de mood y patterns
 * - mood_insights: Análisis de patrones emocionales
 * - extended_history: Historial completo sin límite
 * 
 * RETENTION PREMIUM (mantiene):
 * - data_export: Control total de información
 * - garden_decorations: Logros y milestones
 * 
 * FUTURE INTELLIGENCE (alto valor percibido):
 * - custom_themes: Personalización avanzada
 * - [FUTURO] mood_predictions: Predicción de patrones
 * - [FUTURO] wellness_coaching: Recomendaciones personalizadas
 * - [FUTURO] community_insights: Comparación anónima
 * 
 * ═══════════════════════════════════════════════════════════════
 * CONVERSION STRATEGY
 * ═══════════════════════════════════════════════════════════════
 * 
 * ENGANCHAN EN TRIAL:
 * → advanced_stats (día 1-2): Impacto visual inmediato
 * → mood_insights (día 3-4): Revelación emocional
 * → extended_history (día 5-6): Conexión con el pasado
 * 
 * JUSTIFICAN PAGO:
 * → data_export: Control y privacidad (valor racional)
 * → mood_insights: Auto-conocimiento (valor emocional)
 * → advanced_stats: Progreso visible (valor aspiracional)
 * 
 * HACEN INDISPENSABLE:
 * → extended_history: No perder el viaje
 * → garden_decorations: Reconocimiento del esfuerzo
 * → [FUTURO] mood_predictions: Anticipar necesidades
 * 
 * ═══════════════════════════════════════════════════════════════
 * UX TOUCHPOINTS (sin implementar todavía)
 * ═══════════════════════════════════════════════════════════════
 * 
 * DIARY PAGE:
 * - FREE: Sin límite de entradas
 * - TRIAL: Badge sutil "Probando Premium"
 * - PREMIUM: Sin badges (experiencia limpia)
 * 
 * STATISTICS PAGE:
 * - FREE: Métricas básicas (total, racha)
 * - TRIAL/PREMIUM: advanced_stats (gráficos completos)
 * - TRIAL_EXPIRED: Preview con blur + mensaje calmado
 * 
 * GARDEN PAGE:
 * - FREE: Plantas y crecimiento básico
 * - TRIAL/PREMIUM: garden_decorations (logros, milestones)
 * - TRIAL_EXPIRED: Milestones visibles pero sin nuevos
 * 
 * PROFILE PAGE:
 * - FREE: Info básica
 * - TRIAL: Indicador de días restantes
 * - PREMIUM: Badge discreto opcional
 * 
 * SETTINGS PAGE:
 * - FREE: Config básica
 * - TRIAL/PREMIUM: data_export disponible
 * - PREMIUM: Gestión de suscripción
 */

import { isTrialActive as checkTrialActive } from '../config/trial'

/**
 * Features del sistema
 */
export type FeatureName =
  | 'advanced_stats'
  | 'extended_history'
  | 'data_export'
  | 'custom_themes'
  | 'mood_insights'
  | 'garden_decorations'

/**
 * User plan types
 */
export type Plan = 'free' | 'trial' | 'premium'

/**
 * Get current user plan
 * FUTURO: Sincronizar con backend
 */
export function getUserPlan(): Plan {
  if (isTrialActive()) return 'trial'
  return 'free'
}

/**
 * Trial configuration
 */
const TRIAL_DAYS = 7
const TRIAL_STORAGE_KEY = 'nanevida_trial_started_at'
const TRIAL_USED_KEY = 'nanevida_trial_used'

/**
 * Trial Experience - Copy placeholders
 */
export const TRIAL_COPY = {
  cta: "Probar Premium 7 días gratis",
  active: "Premium Trial",
  daysLeft: (days: number) => `${days} día${days !== 1 ? 's' : ''} restante${days !== 1 ? 's' : ''}`,
  expiringSoon: "Tu prueba Premium termina pronto",
  free: "Estás usando la versión gratuita",
  tryPremium: "Descubre Premium",
} as const

/**
 * Premium Value Props
 */
export const PREMIUM_VALUE = {
  advanced_stats: "Con el tiempo, aquí aparecen patrones más profundos",
  mood_insights: "Tu ánimo tiene un ritmo. Aquí puedes verlo.",
  extended_history: "Tu viaje completo, sin límites de tiempo",
  data_export: "Tu información, siempre bajo tu control",
  garden_decorations: "Cada logro merece ser celebrado",
  custom_themes: "Hazlo sentir tuyo",
} as const

/**
 * Verifica si el usuario ya usó su trial
 */
export function hasUsedTrial(): boolean {
  return localStorage.getItem(TRIAL_USED_KEY) === 'true'
}

/**
 * Inicia trial (solo una vez por usuario)
 */
export function startTrial(): void {
  if (!hasUsedTrial() && !getTrialStartedAt()) {
    localStorage.setItem(TRIAL_STORAGE_KEY, Date.now().toString())
    localStorage.setItem(TRIAL_USED_KEY, 'true')
  }
}

/**
 * Obtiene timestamp de inicio del trial
 */
export function getTrialStartedAt(): number | null {
  const stored = localStorage.getItem(TRIAL_STORAGE_KEY)
  return stored ? parseInt(stored, 10) : null
}

/**
 * Limpia trial (solo en logout)
 */
export function clearTrial(): void {
  localStorage.removeItem(TRIAL_STORAGE_KEY)
  localStorage.removeItem(TRIAL_USED_KEY)
}

/**
 * Verifica si trial está activo
 */
export function isTrialActive(): boolean {
  const startedAt = getTrialStartedAt()
  if (!startedAt) return false
  
  const now = Date.now()
  const trialEnd = startedAt + (TRIAL_DAYS * 24 * 60 * 60 * 1000)
  return now < trialEnd
}

/**
 * Obtiene días restantes de trial
 */
export function getTrialDaysLeft(): number {
  const startedAt = getTrialStartedAt()
  if (!startedAt) return 0
  
  const now = Date.now()
  const trialEnd = startedAt + (TRIAL_DAYS * 24 * 60 * 60 * 1000)
  const msLeft = trialEnd - now
  
  if (msLeft <= 0) return 0
  return Math.ceil(msLeft / (24 * 60 * 60 * 1000))
}

/**
 * Verifica si trial está expirado
 */
export function isTrialExpired(): boolean {
  const startedAt = getTrialStartedAt()
  if (!startedAt) return false
  
  const now = Date.now()
  const trialEnd = startedAt + (TRIAL_DAYS * 24 * 60 * 60 * 1000)
  return now >= trialEnd
}

/**
 * Verifica si trial expira pronto (≤3 días)
 */
export function isTrialExpiringSoon(): boolean {
  const daysLeft = getTrialDaysLeft()
  return isTrialActive() && daysLeft <= 3 && daysLeft > 0
}

/**
 * Obtiene timestamp de expiración del trial
 */
export function getTrialExpiredAt(): number | null {
  const startedAt = getTrialStartedAt()
  if (!startedAt) return null
  
  const trialEnd = startedAt + (TRIAL_DAYS * 24 * 60 * 60 * 1000)
  const now = Date.now()
  
  // Si trial expiró, retornar timestamp de expiración
  if (now >= trialEnd) return trialEnd
  
  return null
}

/**
 * Obtiene días desde que expiró el trial (para mensajes post-trial)
 */
export function getDaysSinceTrialExpired(): number | null {
  const expiredAt = getTrialExpiredAt()
  if (!expiredAt) return null
  
  const now = Date.now()
  const msSinceExpired = now - expiredAt
  return Math.floor(msSinceExpired / (24 * 60 * 60 * 1000))
}

/**
 * Verifica si mostrar mensaje post-trial (primeros 3 días)
 */
export function shouldShowPostTrialMessage(): boolean {
  const daysSince = getDaysSinceTrialExpired()
  return daysSince !== null && daysSince >= 0 && daysSince < 3
}

/**
 * Verifica si una feature está disponible
 */
export function hasFeature(feature: FeatureName): boolean {
  // Trial global activo = acceso completo (integración con trial.ts)
  if (checkTrialActive()) return true
  
  // TODO: Backend premium check
  // if (isPremium) return true
  
  // Trial legacy activo (mantener compatibilidad)
  if (isTrialActive()) return true
  
  // FREE: sin features premium
  return false
}
