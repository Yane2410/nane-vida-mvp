import { isTrialActive, getTrialDaysLeft } from '../utils/features'

/**
 * TrialBadge - Indicador sutil de trial activo
 * 
 * Muestra días restantes cuando trial está activo.
 * NO usa rojo, solo tonos calmados (purple/blue).
 * NO es invasivo, solo informativo.
 */
export default function TrialBadge() {
  const trialActive = isTrialActive()
  const daysLeft = getTrialDaysLeft()

  if (!trialActive) return null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm">
      <span className="text-purple-700 dark:text-purple-300 font-medium">
        ✨ Premium activo
      </span>
      <span className="text-purple-600 dark:text-purple-400 text-xs">
        · {daysLeft} {daysLeft === 1 ? 'día' : 'días'} restantes
      </span>
    </div>
  )
}
