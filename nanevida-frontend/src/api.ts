import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// === Configuration ===
const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10)
const tokenKey = 'nane_token'
const refreshTokenKey = 'nane_refresh_token'

// === Token Management (Secure) ===
export function setTokens(accessToken: string, refreshToken?: string) {
  try {
    localStorage.setItem(tokenKey, accessToken)
    if (refreshToken) {
      localStorage.setItem(refreshTokenKey, refreshToken)
    }
  } catch (error) {
    console.error('Error saving tokens:', error)
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(tokenKey)
  } catch (error) {
    console.error('Error retrieving token:', error)
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(refreshTokenKey)
  } catch (error) {
    console.error('Error retrieving refresh token:', error)
    return null
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(refreshTokenKey)
  } catch (error) {
    console.error('Error clearing tokens:', error)
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= exp
  } catch {
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
    // Success response
    return response
  },
  async (error: AxiosError) => {
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

          const { access } = response.data
          setTokens(access, refreshToken)
          
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
      console.error('Access forbidden')
    }

    if (error.response?.status === 404) {
      console.error('Resource not found')
    }

    if (error.response && error.response.status >= 500) {
      console.error('Server error')
    }

    return Promise.reject(error)
  }
)

// === API Helper Functions ===
export const apiHelpers = {
  // Sanitize user input (basic XSS prevention)
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '')
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
export function setSlowRequestCallback(_callback: ((url: string) => void) | null) {
  // no-op hook for slow-request UX
}

export function getReadableError(error: unknown): string {
  return apiHelpers.getErrorMessage(error)
}
