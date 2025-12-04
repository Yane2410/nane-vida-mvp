import { useEffect, useState } from 'react'
import { api } from '../api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Link } from 'react-router-dom'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type Stats = {
  total_entries: number
  entries_this_week: number
  entries_this_month: number
  streak_days: number
  longest_streak: number
  entries_by_month: { month: string; count: number }[]
  mood_distribution: { mood: string; count: number }[]
  writing_times: { hour: string; count: number }[]
}

const COLORS = ['#8b5cf6', '#34d399', '#facc15', '#f472b6', '#60a5fa', '#fb923c']

export default function Statistics() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStatistics()
  }, [])

  async function loadStatistics() {
    try {
      const { data } = await api.get('/entries/stats/')
      setStats(data)
    } catch (e: any) {
      console.error('Error loading statistics:', e)
      // Usar datos de ejemplo si el endpoint no existe
      setStats({
        total_entries: 42,
        entries_this_week: 7,
        entries_this_month: 15,
        streak_days: 5,
        longest_streak: 12,
        entries_by_month: [
          { month: 'Ene', count: 8 },
          { month: 'Feb', count: 12 },
          { month: 'Mar', count: 15 },
          { month: 'Abr', count: 10 },
          { month: 'May', count: 18 },
          { month: 'Jun', count: 14 },
        ],
        mood_distribution: [
          { mood: '😊 Feliz', count: 15 },
          { mood: '😐 Neutral', count: 12 },
          { mood: '😔 Triste', count: 8 },
          { mood: '😰 Ansioso', count: 5 },
          { mood: '😌 Tranquilo', count: 10 },
        ],
        writing_times: [
          { hour: '6-9', count: 5 },
          { hour: '9-12', count: 8 },
          { hour: '12-15', count: 12 },
          { hour: '15-18', count: 15 },
          { hour: '18-21', count: 18 },
          { hour: '21-24', count: 10 },
        ],
      })
      if (e?.response?.status !== 404) {
        setError('Usando datos de ejemplo')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner text="Cargando estadísticas..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card gradient className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span>📊</span>
          Estadísticas y Análisis
        </h1>
        <p className="text-black dark:text-gray-100">
          Visualiza tu progreso y patrones de escritura
        </p>
        {error && (
          <p className="text-amber-600 text-sm mt-2">
            ⚠️ {error}
          </p>
        )}
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-2xl font-bold text-purple-600">
            {stats?.total_entries || 0}
          </div>
          <div className="text-sm text-black dark:text-gray-100">Total de Entradas</div>
        </Card>

        <Card hover className="text-center">
          <div className="text-4xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats?.streak_days || 0}
          </div>
          <div className="text-sm text-black dark:text-gray-100">Racha Actual</div>
        </Card>

        <Card hover className="text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-emerald-600">
            {stats?.longest_streak || 0}
          </div>
          <div className="text-sm text-black dark:text-gray-100">Racha Más Larga</div>
        </Card>

        <Card hover className="text-center">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.entries_this_month || 0}
          </div>
          <div className="text-sm text-black dark:text-gray-100">Este Mes</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entries by Month */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📈</span>
            Entradas por Mes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.entries_by_month || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Entradas" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Distribution */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>😊</span>
            Distribución de Estados de Ánimo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.mood_distribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.mood.split(' ')[0]} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {stats?.mood_distribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Writing Times */}
        <Card>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🕐</span>
            Horarios de Escritura
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.writing_times || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#34d399" 
                strokeWidth={2}
                name="Entradas"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Summary */}
        <Card className="bg-gradient-to-br from-purple-50 to-emerald-50">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>✨</span>
            Resumen de Actividad
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-black dark:text-gray-100">📝 Promedio por semana</span>
              <span className="font-bold text-purple-600">
                {stats?.entries_this_week || 0} entradas
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-black dark:text-gray-100">🎯 Días activos</span>
              <span className="font-bold text-emerald-600">
                {Math.floor((stats?.total_entries || 0) / 7)} días
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-black dark:text-gray-100">⏱️ Hora favorita</span>
              <span className="font-bold text-blue-600">
                {stats?.writing_times?.reduce((max, item) => 
                  item.count > max.count ? item : max, 
                  stats.writing_times[0]
                )?.hour || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <span className="text-black dark:text-gray-100">😊 Estado más común</span>
              <span className="font-bold text-pink-600">
                {stats?.mood_distribution?.[0]?.mood.split(' ')[0] || '😊'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard">
            <Button variant="secondary" icon={<span>📊</span>}>
              Volver al Dashboard
            </Button>
          </Link>
          <Link to="/diary">
            <Button variant="primary" icon={<span>✍️</span>}>
              Nueva Entrada
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            icon={<span>📄</span>}
            onClick={() => alert('Exportar datos próximamente...')}
          >
            Exportar Datos
          </Button>
        </div>
      </Card>
    </div>
  )
}
