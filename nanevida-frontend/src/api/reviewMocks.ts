import type { InternalAxiosRequestConfig } from 'axios'

type ReviewEntry = {
  id: number
  title: string
  content: string
  emoji?: string
  mood?: string
  created_at: string
}

type ReviewMockResult = {
  status: number
  data: any
  blocked?: boolean
}

const now = Date.now()
const iso = (offsetDays: number) => new Date(now - offsetDays * 86400000).toISOString()

let nextEntryId = 3
let reviewEntries: ReviewEntry[] = [
  {
    id: 1,
    title: 'Mi primer registro',
    content: 'Hoy decidi pausar y respirar con calma.',
    mood: 'happy',
    created_at: iso(1),
  },
  {
    id: 2,
    title: 'Un momento para mi',
    content: 'Anote tres cosas que salieron bien.',
    mood: 'neutral',
    created_at: iso(3),
  },
]

let reviewProfile = {
  username: 'Review User',
  email: 'review@example.com',
  bio: 'Vista previa de NaneVida.',
  avatar: null,
  created_at: iso(12),
}

let reviewGarden = {
  id: 1,
  total_plants: 3,
  current_month_plants: 2,
  total_mindful_minutes: 45,
  current_gentle_streak: 3,
  longest_gentle_streak: 5,
  last_practice_date: iso(0),
  garden_started: iso(14),
  garden_age_days: 14,
  recent_plants: [
    {
      id: 1,
      flower: {
        id: 1,
        activity_type: 'breath',
        flower_name: 'Lirio',
        flower_emoji: '*',
        color: '#A78BFA',
        description: 'Serenidad en cada respiracion.',
      },
      growth_stage: 'blooming',
      times_watered: 3,
      planted_date: iso(5),
      bloomed_date: iso(1),
      position_x: 20,
      position_y: 35,
      stage_emoji: '*',
      days_old: 5,
    },
  ],
  recent_activities: [],
  unviewed_milestones: [
    {
      id: 1,
      milestone_type: 'streak',
      title: 'Semana suave',
      description: 'Has mantenido una racha amable.',
      icon: '*',
      achieved_at: iso(2),
      is_viewed: false,
    },
  ],
  blooming_plants: 1,
}

const reviewSos = [
  {
    id: 1,
    title: 'Linea de apoyo emocional',
    type: 'CALL',
    url: 'tel:+000000000',
    priority: 1,
    active: true,
  },
  {
    id: 2,
    title: 'Guia de primeros auxilios emocionales',
    type: 'LINK',
    url: 'https://example.com',
    priority: 2,
    active: true,
  },
  {
    id: 3,
    title: 'Consejos de autocuidado',
    type: 'TEXT',
    priority: 3,
    active: true,
  },
]

function parseBody(data: any): Record<string, any> {
  if (!data) return {}
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return {}
    }
  }
  if (typeof data === 'object') return data as Record<string, any>
  return {}
}

function normalizePath(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL || 'http://localhost'
  const full = new URL(config.url || '', base)
  let path = full.pathname
  if (path.startsWith('/api/')) {
    path = path.slice(4)
  }
  if (!path.startsWith('/')) path = `/${path}`
  if (!path.endsWith('/')) path = `${path}/`
  return path
}

function buildEntryStats() {
  const total = reviewEntries.length
  const nowDate = new Date()
  const weekAgo = new Date(nowDate)
  weekAgo.setDate(nowDate.getDate() - 7)
  const monthAgo = new Date(nowDate)
  monthAgo.setDate(nowDate.getDate() - 30)

  const entriesThisWeek = reviewEntries.filter((entry) => new Date(entry.created_at) >= weekAgo).length
  const entriesThisMonth = reviewEntries.filter((entry) => new Date(entry.created_at) >= monthAgo).length

  return {
    total_entries: total,
    entries_this_week: entriesThisWeek,
    entries_this_month: entriesThisMonth,
    streak_days: Math.min(entriesThisWeek, 7),
    last_entry_date: reviewEntries[0]?.created_at,
  }
}

function buildMoodStats() {
  const moodCounts: Record<string, number> = {}
  reviewEntries.forEach((entry) => {
    const mood = entry.mood || 'neutral'
    moodCounts[mood] = (moodCounts[mood] || 0) + 1
  })

  return {
    mood_counts: moodCounts,
    mood_timeline: reviewEntries.map((entry) => ({
      date: entry.created_at,
      mood: entry.mood || 'neutral',
      title: entry.title,
    })),
    total_entries: reviewEntries.length,
    days: 14,
  }
}

export function getReviewMockResponse(config: InternalAxiosRequestConfig): ReviewMockResult {
  const method = (config.method || 'get').toUpperCase()
  const path = normalizePath(config)

  if (method === 'GET' && path === '/health/') {
    return { status: 200, data: { status: 'ok', mode: 'review' } }
  }

  if (path === '/profile/' && method === 'GET') {
    return { status: 200, data: reviewProfile }
  }

  if (path === '/profile/' && method === 'PUT') {
    const payload = parseBody(config.data)
    reviewProfile = { ...reviewProfile, ...payload }
    return { status: 200, data: reviewProfile }
  }

  if (path === '/profile/' && method === 'DELETE') {
    return { status: 204, data: {} }
  }

  if (path === '/auth/change-password/' && method === 'POST') {
    return { status: 200, data: { detail: 'ok' } }
  }

  if (path === '/auth/logout/' && method === 'POST') {
    return { status: 204, data: {} }
  }

  if (path === '/entries/' && method === 'GET') {
    return { status: 200, data: { results: reviewEntries } }
  }

  if (path === '/entries/' && method === 'POST') {
    const payload = parseBody(config.data)
    const entry: ReviewEntry = {
      id: nextEntryId++,
      title: payload.title || 'Nueva entrada',
      content: payload.content || '',
      emoji: payload.emoji,
      mood: payload.mood,
      created_at: new Date().toISOString(),
    }
    reviewEntries = [entry, ...reviewEntries]
    return { status: 201, data: entry }
  }

  const entryMatch = path.match(/^\/entries\/(\d+)\/$/)
  if (entryMatch) {
    const entryId = Number(entryMatch[1])
    if (method === 'PUT') {
      const payload = parseBody(config.data)
      reviewEntries = reviewEntries.map((entry) =>
        entry.id === entryId ? { ...entry, ...payload } : entry
      )
      const updated = reviewEntries.find((entry) => entry.id === entryId)
      return { status: 200, data: updated }
    }
    if (method === 'DELETE') {
      reviewEntries = reviewEntries.filter((entry) => entry.id !== entryId)
      return { status: 204, data: {} }
    }
  }

  if (path === '/entries/stats/' && method === 'GET') {
    return { status: 200, data: buildEntryStats() }
  }

  if (path === '/mood-stats/' && method === 'GET') {
    return { status: 200, data: buildMoodStats() }
  }

  if (path === '/garden/' && method === 'GET') {
    return { status: 200, data: reviewGarden }
  }

  if (path === '/garden/plant_seed/' && method === 'POST') {
    const payload = parseBody(config.data)
    const newPlant = {
      id: reviewGarden.recent_plants.length + 1,
      flower: {
        id: 1,
        activity_type: payload.activity_type || 'calm',
        flower_name: 'Lirio',
        flower_emoji: '*',
        color: '#A78BFA',
        description: 'Serenidad en cada respiracion.',
      },
      growth_stage: 'sprout',
      times_watered: 1,
      planted_date: new Date().toISOString(),
      bloomed_date: null,
      position_x: 30,
      position_y: 40,
      stage_emoji: '*',
      days_old: 1,
    }

    reviewGarden = {
      ...reviewGarden,
      total_plants: reviewGarden.total_plants + 1,
      current_month_plants: reviewGarden.current_month_plants + 1,
      total_mindful_minutes: reviewGarden.total_mindful_minutes + (payload.duration_minutes || 0),
      recent_plants: [newPlant, ...reviewGarden.recent_plants],
    }

    return { status: 200, data: { garden: reviewGarden } }
  }

  if (path === '/garden/mark_milestone_viewed/' && method === 'POST') {
    const payload = parseBody(config.data)
    reviewGarden = {
      ...reviewGarden,
      unviewed_milestones: reviewGarden.unviewed_milestones.filter(
        (milestone: any) => milestone.id !== payload.milestone_id
      ),
    }
    return { status: 200, data: { ok: true } }
  }

  if (path === '/sos/' && method === 'GET') {
    return { status: 200, data: { results: reviewSos } }
  }

  return {
    status: 501,
    data: { detail: 'Not implemented in review mode.' },
    blocked: true,
  }
}

