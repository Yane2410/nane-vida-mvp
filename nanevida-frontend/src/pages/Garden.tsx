import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../components/ui/AppHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useGarden, Plant } from '../contexts/GardenContext'

export default function Garden() {
  const navigate = useNavigate()
  const { garden, loading, refreshGarden } = useGarden()

  useEffect(() => {
    refreshGarden()
  }, [])

  if (loading && !garden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950 dark:via-purple-950 dark:to-pink-950">
        <AppHeader greeting="Tu Jardín de Bienestar" />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  const getGentleMessage = () => {
    if (!garden) return ''
    if (garden.total_plants === 0) {
      return '¡Te damos la bienvenida a tu jardín! Cada vez que practiques autocuidado, plantarás una semilla.'
    }
    if (garden.current_gentle_streak >= 7) {
      return `Has cuidado tu jardín ${garden.current_gentle_streak} días. Tu dedicación florece hermosamente. 🌸`
    }
    if (garden.current_gentle_streak >= 3) {
      return `${garden.current_gentle_streak} días nutriendo tu bienestar. Cada día es un regalo. 🌱`
    }
    if (garden.blooming_plants > 0) {
      return `${garden.blooming_plants} flores están floreciendo. Tu esfuerzo da frutos. 🌺`
    }
    return 'Cada momento de autocuidado es una semilla de bienestar. 🌿'
  }

  const getStageEmoji = (stage: string) => {
    const stages: { [key: string]: string } = {
      seed: '🌰',
      sprout: '🌱',
      growing: '🌿',
      blooming: '✨'
    }
    return stages[stage] || '🌱'
  }

  const getStageText = (stage: string) => {
    const texts: { [key: string]: string } = {
      seed: 'Semilla',
      sprout: 'Brote',
      growing: 'Creciendo',
      blooming: 'Floreciendo'
    }
    return texts[stage] || stage
  }

  const groupPlantsByStage = () => {
    if (!garden?.recent_plants) return { blooming: [], growing: [], sprout: [], seed: [] }
    
    return garden.recent_plants.reduce((acc: any, plant: Plant) => {
      const stage = plant.growth_stage
      if (!acc[stage]) acc[stage] = []
      acc[stage].push(plant)
      return acc
    }, { blooming: [], growing: [], sprout: [], seed: [] })
  }

  const plantsByStage = groupPlantsByStage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950 dark:via-purple-950 dark:to-pink-950 pb-24">
      <div className="flex justify-center pt-6 pb-4">
        <img 
          src="/icons/logo-icon.png" 
          alt="Nane Vida" 
          className="h-12 w-auto opacity-80 rounded-xl"
        />
      </div>
      <AppHeader greeting="Tu Jardín de Bienestar" subtitle="Tu viaje de autocuidado florece aquí" />
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Gentle Welcome Message */}
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 dark:from-violet-900/30 dark:to-purple-900/30 dark:border-violet-700">
          <p className="text-center text-violet-800 dark:text-violet-200 font-medium leading-relaxed">
            {getGentleMessage()}
          </p>
        </Card>

        {/* Garden Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900 dark:to-purple-800 dark:border-purple-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{garden?.total_plants || 0}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">Plantas Totales</div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 dark:from-pink-900 dark:to-pink-800 dark:border-pink-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-700 dark:text-pink-300">{garden?.blooming_plants || 0}</div>
              <div className="text-sm text-pink-600 dark:text-pink-400 mt-1">Floreciendo</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 dark:from-indigo-900 dark:to-indigo-800 dark:border-indigo-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{garden?.current_gentle_streak || 0}</div>
              <div className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">Días de Cuidado</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900 dark:to-green-800 dark:border-green-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{garden?.total_mindful_minutes || 0}</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">Minutos</div>
            </div>
          </Card>
        </div>

        {/* Empty Garden State */}
        {(!garden?.recent_plants || garden.recent_plants.length === 0) && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-violet-900 dark:text-violet-100 mb-2">
              Tu jardín está esperando florecer
            </h3>
            <p className="text-violet-800 dark:text-violet-200 mb-6 max-w-md mx-auto">
              Completa una actividad de bienestar para plantar tu primera semilla. 
              Cada práctica es un acto de amor hacia ti misma.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => navigate('/breath')} variant="secondary">
                🌸 Respiración
              </Button>
              <Button onClick={() => navigate('/calm')} variant="secondary">
                💜 Calma
              </Button>
              <Button onClick={() => navigate('/diary')} variant="secondary">
                🌹 Diario
              </Button>
            </div>
          </Card>
        )}

        {/* Garden Grid by Stage */}
        {garden?.recent_plants && garden.recent_plants.length > 0 && (
          <div className="space-y-6">
            {/* Blooming Plants */}
            {plantsByStage.blooming?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  ✨ Floreciendo ({plantsByStage.blooming.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {plantsByStage.blooming.map((plant: any) => (
                    <Card key={plant.id} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                      <div className="text-4xl mb-2">{plant.stage_emoji}</div>
                      <div className="text-xs text-slate-800 dark:text-slate-100 font-medium">{plant.flower.flower_name}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">{plant.days_old} días</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Growing Plants */}
            {plantsByStage.growing?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  🌿 Creciendo ({plantsByStage.growing.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {plantsByStage.growing.map((plant: any) => (
                    <Card key={plant.id} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <div className="text-4xl mb-2">{getStageEmoji(plant.growth_stage)}</div>
                      <div className="text-xs text-slate-800 dark:text-slate-100 font-medium">{plant.flower.flower_name}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">{plant.days_old} días</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Sprout Plants */}
            {plantsByStage.sprout?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  🌱 Brotando ({plantsByStage.sprout.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {plantsByStage.sprout.map((plant: any) => (
                    <Card key={plant.id} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-lime-50 to-green-50 border-lime-200">
                      <div className="text-4xl mb-2">{getStageEmoji(plant.growth_stage)}</div>
                      <div className="text-xs text-slate-800 dark:text-slate-100 font-medium">{plant.flower.flower_name}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">{plant.days_old} días</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Seed Plants */}
            {plantsByStage.seed?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  🌰 Semillas ({plantsByStage.seed.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {plantsByStage.seed.map((plant: any) => (
                    <Card key={plant.id} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                      <div className="text-4xl mb-2">{getStageEmoji(plant.growth_stage)}</div>
                      <div className="text-xs text-slate-800 dark:text-slate-100 font-medium">{plant.flower.flower_name}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-200 mt-1">{plant.days_old} días</div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Milestones Section */}
        {garden?.unviewed_milestones && garden.unviewed_milestones.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-violet-900 dark:text-violet-100 mb-4">🏆 Logros</h3>
            <div className="space-y-2">
              {garden.unviewed_milestones.slice(0, 5).map((milestone: any) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                  <div className="text-2xl">{milestone.icon || '🌟'}</div>
                  <div className="flex-1">
                    <div className="font-medium text-violet-900 dark:text-purple-300">{milestone.title}</div>
                    <div className="text-sm text-violet-800 dark:text-purple-300">{milestone.description}</div>
                  </div>
                  {!milestone.viewed && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Garden Philosophy */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 dark:from-indigo-900 dark:to-purple-900 dark:border-indigo-700">
          <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3">🌸 Sobre tu Jardín</h3>
          <div className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
            <p>• Cada actividad de bienestar planta una semilla en tu jardín</p>
            <p>• Tus plantas crecen naturalmente con el tiempo</p>
            <p>• No hay presión ni competencia, solo crecimiento</p>
            <p>• Tu jardín refleja tu viaje de autocuidado</p>
            <p>• Cada flor representa un momento que dedicaste a ti misma 💜</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
