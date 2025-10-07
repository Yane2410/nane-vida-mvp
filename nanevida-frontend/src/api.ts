import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'
const tokenKey = 'nane_token'

export function setToken(t: string) {
  localStorage.setItem(tokenKey, t)
}

export function getToken() {
  return localStorage.getItem(tokenKey)
}

export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const t = getToken()
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
