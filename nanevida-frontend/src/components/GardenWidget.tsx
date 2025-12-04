import { useGarden } from '../contexts/GardenContext'
import Card from './ui/Card'
import LoadingSpinner from './ui/LoadingSpinner'
import { Link } from 'react-router-dom'

export default function GardenWidget() {
  const { garden, loading } = useGarden()

  if (loading) {
    return (
      <Card>
        <LoadingSpinner size="sm" />
      </Card>
    )
  }

  if (!garden) return null

  return (
    <Link to="/garden">
      <Card hover className="cursor-pointer transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-black dark:text-white dark:text-white flex items-center gap-2">
            <span>🌸</span>
            Tu Jardín de Bienestar
          </h3>
          <span className="text-sm text-purple-600 dark:text-purple-400">Ver más →</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Total Plants */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {garden.total_plants}
            </div>
            <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              Plantas Totales
            </div>
          </div>

          {/* Blooming Plants */}
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-3">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {garden.blooming_plants}
            </div>
            <div className="text-xs text-pink-700 dark:text-pink-300 font-medium">
              En Flor
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
              {garden.current_gentle_streak > 0 && '🔥'}
              {garden.current_gentle_streak}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">
              Días de Práctica
            </div>
          </div>

          {/* Mindful Minutes */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {garden.total_mindful_minutes}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Minutos Dedicados
            </div>
          </div>
        </div>

        {/* Recent Plants Preview */}
        {garden.recent_plants && garden.recent_plants.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-sm text-black dark:text-white font-medium">
              Últimas plantas:
            </span>
            <div className="flex gap-1">
              {garden.recent_plants.slice(0, 5).map((plant) => (
                <span
                  key={plant.id}
                  className="text-2xl"
                  title={`${plant.flower.flower_name} - ${plant.growth_stage}`}
                >
                  {plant.stage_emoji}
                </span>
              ))}
              {garden.recent_plants.length > 5 && (
                <span className="text-sm text-slate-900 dark:text-white self-center">
                  +{garden.recent_plants.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Gentle Message */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <p className="text-sm text-black dark:text-white italic text-center">
            {garden.current_gentle_streak > 0 
              ? `✨ ${garden.current_gentle_streak} ${garden.current_gentle_streak === 1 ? 'día' : 'días'} nutriendo tu bienestar`
              : '🌱 Tu jardín te espera cuando estés list@'
            }
          </p>
        </div>
      </Card>
    </Link>
  )
}
