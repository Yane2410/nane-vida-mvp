export function normalizeApiBase(base: string): string {
  const trimmed = base.trim()
  if (!trimmed) return ''

  let normalized = trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed

  if (normalized.endsWith('/api/api')) {
    normalized = normalized.replace(/\/api\/api$/, '/api')
  }

  if (!normalized.endsWith('/api')) {
    normalized = `${normalized}/api`
  }

  return normalized
}

export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE?.trim()
  if (raw) {
    return normalizeApiBase(raw)
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api'
  }

  return ''
}
