/**
 * Conversion Tracker - Local Analytics
 * 
 * Registra eventos de conversión en localStorage para métricas futuras.
 * NO envía datos externos.
 * NO hace console logs.
 * Base para analytics cuando se integre backend.
 */

const TRACKER_KEY = 'nanevida_conversion_events'

type ConversionEvent = 
  | 'intent_premium_click'
  | 'premium_page_view'
  | 'trial_expired_seen'
  | 'soft_paywall_seen'
  | 'urgency_message_seen'
  | 'cta_dismiss'
  | 'pricing_view'
  | 'pricing_plan_click'
  | 'trial_start_intent'
  | 'trial_started'
  | 'trial_expired'
  | 'premium_block_view'
  | 'pricing_intelligent_view'
  | 'premium_intent_saved'
  | 'premium_coming_soon_view'
  | 'premium_notify_requested'

interface TrackedEvent {
  event: ConversionEvent
  timestamp: number
  context?: Record<string, string | number | boolean>
}

/**
 * Registra evento de conversión (silent)
 */
export function trackConversionEvent(
  event: ConversionEvent,
  context?: Record<string, string | number | boolean>
): void {
  try {
    const events = getConversionEvents()
    const newEvent: TrackedEvent = {
      event,
      timestamp: Date.now(),
      context
    }
    
    events.push(newEvent)
    
    // Limitar a últimos 50 eventos (evitar crecimiento infinito)
    const limited = events.slice(-50)
    
    localStorage.setItem(TRACKER_KEY, JSON.stringify(limited))
  } catch (error) {
    // Silent fail (no bloquear UX)
  }
}

/**
 * Obtiene eventos registrados
 */
export function getConversionEvents(): TrackedEvent[] {
  try {
    const stored = localStorage.getItem(TRACKER_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Limpia eventos (logout)
 */
export function clearConversionEvents(): void {
  try {
    localStorage.removeItem(TRACKER_KEY)
  } catch {
    // Silent fail
  }
}

/**
 * Cuenta veces que usuario vio soft paywall
 */
export function getPaywallImpressionCount(): number {
  const events = getConversionEvents()
  return events.filter(e => e.event === 'soft_paywall_seen').length
}

/**
 * Verifica si usuario mostró intención (≥1 click en CTA)
 */
export function hasShownIntent(): boolean {
  const events = getConversionEvents()
  return events.some(e => e.event === 'intent_premium_click')
}

/**
 * Obtiene últimas 24h de eventos (para rate limiting)
 */
export function getRecentEvents(hours: number = 24): TrackedEvent[] {
  const events = getConversionEvents()
  const cutoff = Date.now() - (hours * 60 * 60 * 1000)
  return events.filter(e => e.timestamp >= cutoff)
}

/**
 * Verifica si usuario guardó intent de Premium (localStorage)
 */
export function hasPremiumInterest(): boolean {
  return localStorage.getItem('premium_intent') !== null
}

/**
 * Verifica si usuario pidió ser notificado cuando Premium esté listo
 */
export function hasPremiumNotifyRequested(): boolean {
  return localStorage.getItem('premium_notify_requested') !== null
}
