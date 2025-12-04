import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../api';
import Card from './ui/Card';
import LoadingSpinner from './ui/LoadingSpinner';

type MoodStats = {
  mood_counts: {
    very_happy?: number;
    happy?: number;
    neutral?: number;
    sad?: number;
    anxious?: number;
    angry?: number;
  };
  mood_timeline: Array<{
    date: string;
    mood: string;
    title: string;
  }>;
  total_entries: number;
  days: number;
};

const MOOD_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  very_happy: { label: 'Muy feliz', emoji: '😊', color: '#10b981' },
  happy: { label: 'Feliz', emoji: '🙂', color: '#84cc16' },
  neutral: { label: 'Neutral', emoji: '😐', color: '#6b7280' },
  sad: { label: 'Triste', emoji: '😢', color: '#3b82f6' },
  anxious: { label: 'Ansios@', emoji: '😰', color: '#eab308' },
  angry: { label: 'Enojado/a', emoji: '😡', color: '#ef4444' },
};

export default function MoodChart() {
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const { data } = await api.get('/mood-stats/');
      setStats(data);
      setError('');
    } catch (e: any) {
      console.error('Error loading mood stats:', e);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="text-center py-8">
        <p className="text-red-600">❌ {error || 'No hay datos disponibles'}</p>
      </Card>
    );
  }

  if (stats.total_entries === 0) {
    return (
      <Card className="text-center py-12">
        <span className="text-6xl mb-4 block">📊</span>
        <h3 className="text-xl font-semibold text-black dark:text-gray-100 mb-2">
          No hay estadísticas todavía
        </h3>
        <p className="text-slate-900 dark:text-gray-200">
          Comienza a registrar tu estado de ánimo en tus entradas del diario
        </p>
      </Card>
    );
  }

  // Preparar datos para el gráfico de barras
  const barData = Object.entries(stats.mood_counts)
    .filter(([_, count]) => count > 0)
    .map(([mood, count]) => ({
      mood: MOOD_CONFIG[mood]?.label || mood,
      emoji: MOOD_CONFIG[mood]?.emoji || '❓',
      count,
      color: MOOD_CONFIG[mood]?.color || '#6b7280',
    }))
    .sort((a, b) => b.count - a.count);

  // Preparar datos para el gráfico circular
  const pieData = barData.map(item => ({
    name: `${item.emoji} ${item.mood}`,
    value: item.count,
    color: item.color,
  }));

  // Preparar datos para línea temporal (últimas 10 entradas)
  const timelineData = stats.mood_timeline
    .slice(-10)
    .map((entry, index) => ({
      index: index + 1,
      date: new Date(entry.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      mood: entry.mood,
      moodLabel: MOOD_CONFIG[entry.mood]?.label || entry.mood,
      moodValue: getMoodValue(entry.mood),
      title: entry.title || 'Sin título',
    }));

  function getMoodValue(mood: string): number {
    const values: Record<string, number> = {
      very_happy: 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      anxious: 2,
      angry: 1,
    };
    return values[mood] || 3;
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card gradient>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              📊 Estadísticas de Estado de Ánimo
            </h3>
            <p className="text-gray-600">
              {stats.total_entries} {stats.total_entries === 1 ? 'entrada' : 'entradas'} con estado de ánimo registrado
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-900 dark:text-gray-200">Últimos</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.days}</p>
            <p className="text-sm text-slate-900 dark:text-gray-200">días</p>
          </div>
        </div>
      </Card>

      {/* Gráfico de Barras - Distribución de Moods */}
      <Card>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          📊 Distribución de Estados de Ánimo
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="mood" 
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `${value} ${value === 1 ? 'vez' : 'veces'}`,
                props.payload.emoji + ' ' + props.payload.mood
              ]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico Circular */}
        <Card>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            🥧 Proporción de Estados
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Línea Temporal */}
        <Card>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            📈 Evolución Temporal (Últimas 10)
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 6]} 
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  props.payload.moodLabel,
                  props.payload.title
                ]}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="moodValue" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Estado de Ánimo"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-xs text-slate-900 dark:text-gray-200 space-y-1">
            <p>5 = Muy feliz | 4 = Feliz | 3 = Neutral</p>
            <p>2 = Triste/Ansioso | 1 = Enojado</p>
          </div>
        </Card>
      </div>

      {/* Mood más frecuente */}
      {barData.length > 0 && (
        <Card gradient>
          <div className="text-center">
            <p className="text-black dark:text-gray-100 mb-2">Tu estado de ánimo más frecuente es:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl">{barData[0].emoji}</span>
              <div className="text-left">
                <h4 className="text-2xl font-bold text-slate-900">{barData[0].mood}</h4>
                <p className="text-black dark:text-gray-100">
                  {barData[0].count} {barData[0].count === 1 ? 'vez' : 'veces'} ({((barData[0].count / stats.total_entries) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
