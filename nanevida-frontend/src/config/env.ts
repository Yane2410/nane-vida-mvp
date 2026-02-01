/**
 * Environment Configuration
 *
 * Centraliza acceso a variables de entorno y comportamiento segun modo.
 * NO hardcodes, solo lectura de import.meta.env
 */
import { getApiBase as getApiBaseInternal } from './apiBase'

/**
 * Verifica si esta en modo produccion
 */
export function isProd(): boolean {
  return import.meta.env.PROD
}

/**
 * Verifica si esta en modo desarrollo
 */
export function isDev(): boolean {
  return import.meta.env.DEV
}

/**
 * Obtiene base URL del backend API
 *
 * REGLAS:
 * - DEV: permite fallback a localhost:8000 (backend local Django)
 * - PREVIEW/PROD: si falta, devuelve "" (fail-closed)
 */
export function getApiBase(): string {
  return getApiBaseInternal()
}

/**
 * Debug: obtener API base configurada (solo DEV)
 */
export function getApiBaseDebug(): string {
  return getApiBaseInternal()
}
