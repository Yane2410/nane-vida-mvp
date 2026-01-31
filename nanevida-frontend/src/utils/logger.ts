// 🔐 SECURITY: Logger centralizado con control de entorno
// Beneficio: Producción sin logs sensibles, Development con debug completo

const isDev = import.meta.env.MODE === 'development'

export const logger = {
  /**
   * Warning logs - Solo en development
   * Uso: Situaciones anómalas que no rompen la app
   */
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },
  
  /**
   * Error logs - Solo en development
   * En producción: silencioso (o enviar a servicio externo como Sentry)
   */
  error: (message: string, ...args: any[]) => {
    if (isDev) {
      console.error(`[ERROR] ${message}`, ...args)
    } else {
      // En producción: podrías enviar a Sentry/LogRocket
      // Sentry.captureException(args[0])
    }
  },
  
  /**
   * Info logs - Solo en development
   * Uso: Información de debug general
   */
  log: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`[INFO] ${message}`, ...args)
    }
  },
  
  /**
   * Debug logs - Solo en development
   * Uso: Información detallada de debugging
   */
  debug: (message: string, ...args: any[]) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  }
}
