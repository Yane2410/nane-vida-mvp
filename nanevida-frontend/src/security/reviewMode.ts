const REVIEW_GATE_KEY = 'nv_review_gate_ok'
const DEFAULT_ALLOWLIST = ['localhost', '127.0.0.1', '.vercel.app', '.local']

function getHostname(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hostname
}

function parseAllowlist(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_ALLOWLIST
  return raw
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
}

function hostnameAllowed(hostname: string, allowlist: string[]): boolean {
  if (!hostname) return false
  return allowlist.some((entry) => {
    if (!entry) return false
    if (entry.startsWith('.')) {
      return hostname.endsWith(entry)
    }
    return hostname === entry
  })
}

export function isReviewEnabled(): boolean {
  if (import.meta.env.PROD) return false
  if (import.meta.env.VITE_REVIEW_MODE !== 'true') return false
  const allowlist = parseAllowlist(import.meta.env.VITE_REVIEW_HOST_ALLOWLIST)
  return hostnameAllowed(getHostname(), allowlist)
}

export function isReviewRoute(pathname: string): boolean {
  return pathname === '/review' || pathname.startsWith('/review/')
}

export function isReviewGateRequired(): boolean {
  return !!import.meta.env.VITE_REVIEW_GATE_TOKEN
}

export function isReviewGateSatisfied(): boolean {
  if (!isReviewGateRequired()) return true
  try {
    return sessionStorage.getItem(REVIEW_GATE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setReviewGateSatisfied(token: string): boolean {
  const expected = import.meta.env.VITE_REVIEW_GATE_TOKEN
  if (!expected) return true
  if (token !== expected) return false
  try {
    sessionStorage.setItem(REVIEW_GATE_KEY, 'true')
  } catch {
    return false
  }
  return true
}

export function clearReviewGate(): void {
  try {
    sessionStorage.removeItem(REVIEW_GATE_KEY)
  } catch {
    // no-op
  }
}

export function isReviewActive(pathname?: string): boolean {
  if (!isReviewEnabled()) return false
  const currentPath =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '')
  if (!isReviewRoute(currentPath)) return false
  return isReviewGateSatisfied()
}
