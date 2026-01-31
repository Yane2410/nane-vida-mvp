import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { logger } from './utils/logger'
import { clearTrial } from './utils/features'
import { clearConversionEvents } from './utils/conversionTracker'
import { getApiBase } from './config/env'

// === Configuration ===
const API_BASE = getApiBase()
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)
const SLOW_REQUEST_THRESHOLD = 2500 // 2.5s para detectar backend dormido (Render free tier)
const tokenKey = 'nane_token'
const refreshTokenKey = 'nane_refresh_token'

// === Slow Request Callback (para UX) ===
let slowRequestCallback: ((url: string) => void) | null = null

export function setSlowRequestCallback(callback: ((url: string) => void) | null) {
  slowRequestCallback = callback
}

// === Token Management (Secure) ===
// 🔐 SECURITY: Access token en sessionStorage (se borra al cerrar tab)
// Reduce ventana de ataque XSS vs localStorage
export function setTokens(accessToken: string, refreshToken?: string) {
  try {
    // Access token: sessionStorage (temporal, mayor seguridad)
    sessionStorage.setItem(tokenKey, accessToken)
    
    // Refresh token: localStorage (necesario para renovar sesion)
    if (refreshToken) {
      localStorage.setItem(refreshTokenKey, refreshToken)
    }
  } catch (error) {
    logger.error('Error saving tokens:', error)
  }
}

export function getToken(): string | null {
  try {
    // Leer de sessionStorage (migración de seguridad)
    return sessionStorage.getItem(tokenKey)
  } catch (error) {
    logger.error('Error retrieving token:', error)
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(refreshTokenKey)
  } catch (error) {
    logger.error('Error retrieving refresh token:', error)
    return null
  }
}

export function clearTokens() {
  try {
    // Limpiar trial primero
    clearTrial()
    
    // Limpiar eventos de conversión
    clearConversionEvents()
    
    // Limpiar ambos storages
    sessionStorage.removeItem(tokenKey)
    localStorage.removeItem(refreshTokenKey)
  } catch (error) {
    logger.error('Error clearing tokens:', error)
  }
}

export async function logout() {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    try {
      await api.post('/auth/logout/', { refresh: refreshToken })
    } catch {
      // Ignore logout errors, always clear local tokens
    }
  }
  clearTokens()
}

export function isTokenExpired(token: string): boolean {
  try {
    // ✅ VALIDATION: JWT debe tener 3 partes (header.payload.signature)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return true
    }
    
    // JWT usa base64url encoding (no base64 estándar)
    // Convertir base64url a base64: reemplazar - con + y _ con /
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    
    // ✅ PADDING: Agregar '=' si es necesario (base64 requiere múltiplo de 4)
    const pad = base64.length % 4
    if (pad) {
      if (pad === 1) {
        return true // inválido
      }
      base64 += '='.repeat(4 - pad)
    }
    
    const payload = JSON.parse(atob(base64))
    
    // ✅ FAIL-SAFE: Si exp no existe o es inválido, considerar expirado
    if (!payload.exp || typeof payload.exp !== 'number') {
      return true
    }
    
    // exp está en segundos Unix, convertir a ms para comparar con Date.now()
    const expMs = payload.exp * 1000
    return Date.now() >= expMs
  } catch {
    // Cualquier error de parsing: considerar token inválido/expirado
    return true
  }
}

// === Axios Instance Configuration ===
export const api = axios.create({
  baseURL: API_BASE,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Security: Don't send credentials to other domains
  withCredentials: false,
})

// === Request Interceptor ===
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    
    if (token && config.headers) {
      // Check if token is expired (client-side check)
      if (isTokenExpired(token)) {
        console.warn('Token is expired, clearing...')
        clearTokens()
        // Optionally redirect to login
        // window.location.href = '/login'
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    // Security: Add request timestamp for tracking
    if (config.headers) {
      config.headers['X-Request-Time'] = Date.now().toString()
    }
    
    // Detectar backend dormido (Render free tier)
    const startTime = Date.now()
    const slowCheckTimer = setTimeout(() => {
      if (slowRequestCallback && config.url) {
        slowRequestCallback(config.url)
      }
    }, SLOW_REQUEST_THRESHOLD)
    
    // Guardar timer para limpiar en response
    ;(config as any)._slowCheckTimer = slowCheckTimer
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// === Response Interceptor ===
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => {
    // Limpiar timer de slow check
    const timer = (response.config as any)._slowCheckTimer
    if (timer) clearTimeout(timer)
    
    // Success response
    return response
  },
  async (error: AxiosError) => {
    // Limpiar timer de slow check
    const timer = (error.config as any)?._slowCheckTimer
    if (timer) clearTimeout(timer)
    
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the token refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await axios.post(
            `${API_BASE}/token/refresh/`,
            { refresh: refreshToken }
          )

          const { access, refresh: rotatedRefresh } = response.data as {
            access: string
            refresh?: string
          }
          setTokens(access, rotatedRefresh || refreshToken)
          
          // Update the authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`
          }

          processQueue(null)
          isRefreshing = false

          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError as Error)
          clearTokens()
          isRefreshing = false
          
          // Redirect to login
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token available
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      logger.error('Access forbidden')
    }

    if (error.response?.status === 404) {
      logger.error('Resource not found')
    }

    if (error.response && error.response.status >= 500) {
      logger.error('Server error')
    }

    return Promise.reject(error)
  }
)

// === API Helper Functions ===
export const apiHelpers = {
  // 🔐 SECURITY: Sanitize user input (XSS prevention)
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '')                    // Remove angle brackets
      .replace(/javascript:/gi, '')            // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '')             // Remove event handlers (onclick=, onerror=, etc)
      .replace(/data:text\/html/gi, '')       // Remove data URIs
      .trim()
  },
  
  // Format error messages
  getErrorMessage: (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.detail) {
        return error.response.data.detail
      }
      if (error.response?.data?.message) {
        return error.response.data.message
      }
      if (error.message) {
        return error.message
      }
    }
    return 'An unexpected error occurred'
  },
  
  // Check if request is safe from CSRF (for future use)
  isSafeMethod: (method: string): boolean => {
    return ['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method.toUpperCase())
  }
}

// === Error Handling Helper (User-Friendly Messages) ===
// 🎯 MEJORA PROFESIONAL: Mensajes específicos por tipo de error
// Beneficio: Usuario entiende QUÉ pasó y QUÉ hacer
function getReadableError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Sin respuesta = problema de red o timeout
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return 'La conexión está muy lenta. Intenta nuevamente.'
      }
      if (error.message.includes('Network Error')) {
        return 'Sin conexión. Verifica tu WiFi o datos móviles.'
      }
      return 'No pudimos conectar. Verifica tu conexión.'
    }
    
    // Por código de error HTTP
    switch (error.response.status) {
      case 400:
        // Login/auth: credenciales inválidas
        if (error.config?.url?.includes('/token')) {
          return 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
        }
        return error.response.data?.detail || 
               error.response.data?.message ||
               'Datos inválidos. Verifica tu información.'
      case 401:
        // BUGFIX: 401 NO es offline, es auth requerida (no mostrar "sin conexión")
        return 'Tu sesión expiró. Por favor, inicia sesión nuevamente.'
      case 403:
        return 'No tienes permiso para acceder a esto.'
      case 404:
        return 'No encontramos lo que buscas.'
      case 429:
        return 'Demasiados intentos. Espera un momento.'
      case 500:
      case 502:
      case 503:
        return 'Problema temporal en el servidor. Intenta en 1 minuto.'
      default:
        return error.response.data?.detail || 
               error.response.data?.message ||
               'Algo salió mal. Intenta nuevamente.'
    }
  }
  
  return 'Error inesperado. Si persiste, contáctanos.'
}

export { getReadableError }
