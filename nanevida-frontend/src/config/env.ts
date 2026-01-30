/**
 * Environment Configuration
 * 
 * Centraliza acceso a variables de entorno y comportamiento según modo.
 * NO hardcodes, solo lectura de import.meta.env
 */

/**
 * Verifica si está en modo producción
 */
export function isProd(): boolean {
  return import.meta.env.PROD
}

/**
 * Verifica si está en modo desarrollo
 */
export function isDev(): boolean {
  return import.meta.env.DEV
}

/**
 * Obtiene base URL del backend API
 * 
 * REGLAS:
 * - PROD: VITE_API_BASE es OBLIGATORIO, falla si no existe
 * - DEV: permite fallback a localhost:8000 (backend local Django)
 * - Normaliza URL: sin trailing slash
 * 
 * @throws Error en PROD si VITE_API_BASE no está definida
 */
export function getApiBase(): string {
  const apiBase = import.meta.env.VITE_API_BASE
  const devFallback = 'http://localhost:8000/api'

  // PROD: obligatorio tener VITE_API_BASE configurada
  if (isProd() && !apiBase) {
    throw new Error(
      'VITE_API_BASE environment variable is required in production. ' +
      'Configure it in your deployment platform (Vercel/Render).'
    )
  }

  // DEV: fallback seguro a backend local
  // AUDIT: Usar localhost (match con .env.local) para consistencia
  let base = apiBase || devFallback

  if (isDev()) {
    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(base)
    if (!isLocal) {
      console.warn('[dev] VITE_API_BASE no apunta a localhost. Usando backend local.')
      base = devFallback
    }
  }

  // Normalizar: eliminar trailing slash
  const trimmed = base.endsWith('/') ? base.slice(0, -1) : base

  // Evitar duplicado /api/api
  if (trimmed.endsWith('/api/api')) {
    return trimmed.replace(/\/api\/api$/, '/api')
  }

  // Asegurar /api al final si falta
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`
  }

  return trimmed
}

/**
 * Debug: obtener API base configurada (solo DEV)
 */
export function getApiBaseDebug(): string {
  return getApiBase()
}
