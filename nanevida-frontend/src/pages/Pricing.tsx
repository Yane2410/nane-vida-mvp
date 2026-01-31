import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trackConversionEvent } from '../utils/conversionTracker'
import { 
  PRICING_PAGE_COPY, 
  PRICING_ANCHORS, 
  PLAN_INTENTS 
} from '../constants/pricing'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

/**
 * Pricing Inteligente - Sin Vender Planes
 * 
 * NO muestra precios
 * NO presiona al usuario
 * Vende continuidad y tranquilidad
 * Compara contra costo emocional
 */
export default function Pricing() {
  const navigate = useNavigate()

  useEffect(() => {
    trackConversionEvent('pricing_intelligent_view')
  }, [])

  const handleContinue = () => {
    // Guardar intent (no compra)
    localStorage.setItem('premium_intent', Date.now().toString())
    trackConversionEvent('premium_intent_saved')
    navigate('/coming-soon-premium')
  }

  const basicPlan = PLAN_INTENTS.FREE
  const premiumPlan = PLAN_INTENTS.PREMIUM_MENSUAL

  return (
    <div className="min-h-full animate-page">
      <div className="max-w-4xl mx-auto px-4 pt-2 sm:pt-6 pb-6 space-y-8">
        
        {/* Header Emocional */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {PRICING_PAGE_COPY.header.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {PRICING_PAGE_COPY.header.subtitle}
          </p>
        </div>

        {/* Comparación Silenciosa (NO tabla técnica) */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* BÁSICO */}
          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {PRICING_PAGE_COPY.comparison.basic.label}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {PRICING_PAGE_COPY.comparison.basic.description}
                </p>
              </div>

              <div className="space-y-3">
                {basicPlan.features.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {feature.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {feature.realUse}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* COMPLETO */}
          <Card className="border-2 border-purple-500 dark:border-purple-600 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
            <div className="space-y-6">
              <div>
                <div className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-3">
                  {premiumPlan.intent}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {PRICING_PAGE_COPY.comparison.complete.label}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {PRICING_PAGE_COPY.comparison.complete.description}
                </p>
              </div>

              <div className="space-y-3">
                {premiumPlan.features.map((feature, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      {feature.description}
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      {feature.realUse}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Anclaje Psicológico (sin cifras) */}
        <div className="text-center space-y-4 p-6 bg-card rounded-xl border border-border">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {PRICING_ANCHORS.emotionalCost.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {PRICING_ANCHORS.emotionalCost.message}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            {PRICING_ANCHORS.comparisons.map((comparison, index) => (
              <span key={index} className="text-sm text-purple-600 dark:text-purple-400">
                ✓ {comparison}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Único (NO pago) */}
        <div className="text-center space-y-4">
          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {PRICING_PAGE_COPY.cta.primary}
          </Button>
          <div>
            <Link 
              to="/dashboard"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {PRICING_PAGE_COPY.cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
