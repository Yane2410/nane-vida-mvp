import { getToken, logout as realLogout } from '../../api'
import { clearReviewGate, isReviewActive } from '../../security/reviewMode'

export type ReviewUser = {
  id: string
  name: string
  role: 'review'
}

const reviewUser: ReviewUser = {
  id: 'review-user',
  name: 'Review User',
  role: 'review',
}

export function isAuthenticated(pathname?: string): boolean {
  if (isReviewActive(pathname)) return true
  return !!getToken()
}

export function getCurrentUser(pathname?: string): ReviewUser | null {
  if (isReviewActive(pathname)) return reviewUser
  return null
}

export async function logout(pathname?: string): Promise<void> {
  if (isReviewActive(pathname)) {
    clearReviewGate()
    return
  }
  await realLogout()
}
