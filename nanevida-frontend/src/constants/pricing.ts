/**
 * Pricing Inteligente - Sin Vender Planes, Vender Continuidad
 * 
 * PRINCIPIOS:
 * - No vender planes técnicos, vender tranquilidad
 * - Comparar contra costo emocional, no dinero
 * - Anclaje psicológico sin cifras
 * - Preparar para pago futuro sin cobrar
 */

export type PlanState = 'FREE' | 'PREMIUM_MENSUAL' | 'PREMIUM_ANUAL'

export interface PlanIntent {
  state: PlanState
  intent: string
  emotionalValue: string
  features: {
    description: string
    realUse: string
  }[]
}

/**
 * Estados de usuario (no planes visibles)
 */
export const PLAN_INTENTS: Record<PlanState, PlanIntent> = {
  FREE: {
    state: 'FREE',
    intent: 'Para empezar y conocerte',
    emotionalValue: 'Lo esencial para registrar y avanzar',
    features: [
      {
        description: 'Registra tus emociones diarias',
        realUse: 'Crea el hábito de observarte'
      },
      {
        description: 'Ejercicios básicos de calma',
        realUse: 'Encuentra alivio en momentos difíciles'
      },
      {
        description: 'Tu jardín emocional crece',
        realUse: 'Visualiza tu progreso'
      }
    ]
  },
  PREMIUM_MENSUAL: {
    state: 'PREMIUM_MENSUAL',
    intent: 'Para acompañarte de verdad',
    emotionalValue: 'Acompañamiento continuo y profundidad',
    features: [
      {
        description: 'Entiende tus patrones emocionales',
        realUse: 'Descubre qué te hace sentir mejor'
      },
      {
        description: 'Tu historial completo, siempre disponible',
        realUse: 'No pierdas tu proceso, crece sobre él'
      },
      {
        description: 'Insights personalizados',
        realUse: 'Recibe orientación según tu viaje'
      },
      {
        description: 'Exporta tu información',
        realUse: 'Tu historia es tuya, siempre'
      },
      {
        description: 'Personalización profunda',
        realUse: 'Haz que el espacio sea realmente tuyo'
      }
    ]
  },
  PREMIUM_ANUAL: {
    state: 'PREMIUM_ANUAL',
    intent: 'Para comprometerte con tu bienestar',
    emotionalValue: 'Acompañamiento continuo y profundidad',
    features: [
      {
        description: 'Todo lo de Premium Mensual',
        realUse: 'Sin interrupciones por un año completo'
      },
      {
        description: 'Inversión en ti a largo plazo',
        realUse: 'Menos preocupaciones, más progreso'
      }
    ]
  }
}

/**
 * Anclaje Psicológico (sin cifras)
 */
export const PRICING_ANCHORS = {
  comparisons: [
    'Menos que un café a la semana',
    'Menos que una sesión al mes',
    'Más barato que abandonar tu proceso'
  ],
  emotionalCost: {
    title: 'El verdadero costo',
    message: 'Cuánto vale no perderte, seguir creciendo, sentirte acompañado'
  }
} as const

/**
 * Pricing Page Copy
 */
export const PRICING_PAGE_COPY = {
  header: {
    title: 'Cuida tu bienestar como algo importante',
    subtitle: 'No es una app. Es un espacio que construyes contigo.'
  },
  comparison: {
    basic: {
      label: 'Básico',
      description: 'Lo esencial para registrar y avanzar'
    },
    complete: {
      label: 'Completo',
      description: 'Acompañamiento continuo y profundidad'
    }
  },
  cta: {
    primary: 'Quiero seguir con Premium',
    secondary: 'Volver al inicio'
  }
} as const

/**
 * Coming Soon Copy
 */
export const COMING_SOON_COPY = {
  title: 'Estamos habilitando el acceso completo',
  message: 'Te avisaremos cuando esté listo',
  priority: 'Serás de los primeros',
  cta: 'Avísame cuando esté listo'
} as const

/**
 * Post-Pricing Message (una sola vez)
 */
export const POST_PRICING_MESSAGE = 'Gracias por interesarte en cuidar tu proceso'

/**
 * Helpers
 */
export function getPlanIntent(state: PlanState): PlanIntent {
  return PLAN_INTENTS[state]
}

export function isPremiumState(state: PlanState): boolean {
  return state === 'PREMIUM_MENSUAL' || state === 'PREMIUM_ANUAL'
}
