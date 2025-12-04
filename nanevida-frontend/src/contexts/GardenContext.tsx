import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, getToken } from '../api'

// Types
export interface FlowerType {
  id: number
  activity_type: string
  flower_name: string
  flower_emoji: string
  color: string
  description: string
}

export interface Plant {
  id: number
  flower: FlowerType
  growth_stage: 'seed' | 'sprout' | 'growing' | 'blooming'
  times_watered: number
  planted_date: string
  bloomed_date: string | null
  position_x: number
  position_y: number
  stage_emoji: string
  days_old: number
}

export interface Milestone {
  id: number
  milestone_type: string
  title: string
  description: string
  icon: string
  achieved_at: string
  is_viewed: boolean
}

export interface GardenProfile {
  id: number
  total_plants: number
  current_month_plants: number
  total_mindful_minutes: number
  current_gentle_streak: number
  longest_gentle_streak: number
  last_practice_date: string | null
  garden_started: string
  garden_age_days: number
  recent_plants: Plant[]
  recent_activities: any[]
  unviewed_milestones: Milestone[]
  blooming_plants: number
}

interface GardenContextType {
  garden: GardenProfile | null
  loading: boolean
  error: string
  plantSeed: (activityType: string, durationMinutes?: number) => Promise<any>
  refreshGarden: () => Promise<void>
  markMilestoneViewed: (milestoneId: number) => Promise<void>
  showNewMilestones: () => void
}

const GardenContext = createContext<GardenContextType | undefined>(undefined)

export function GardenProvider({ children }: { children: ReactNode }) {
  const [garden, setGarden] = useState<GardenProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load garden on mount only if user is authenticated
  useEffect(() => {
    const token = getToken()
    if (token) {
      loadGarden()
    } else {
      setLoading(false)
    }
  }, [])

  async function loadGarden() {
    try {
      const { data } = await api.get('/garden/')
      setGarden(data)
      setError('')
    } catch (e: any) {
      console.error('Error loading garden:', e)
      setError('No se pudo cargar tu jardín')
    } finally {
      setLoading(false)
    }
  }

  async function plantSeed(activityType: string, durationMinutes: number = 0) {
    try {
      const { data } = await api.post('/garden/plant_seed/', {
        activity_type: activityType,
        duration_minutes: durationMinutes
      })
      
      // Update garden with new data
      if (data.garden) {
        setGarden(data.garden)
      }
      
      return data
    } catch (e: any) {
      console.error('Error planting seed:', e)
      throw e
    }
  }

  async function refreshGarden() {
    await loadGarden()
  }

  async function markMilestoneViewed(milestoneId: number) {
    try {
      await api.post('/garden/mark_milestone_viewed/', {
        milestone_id: milestoneId
      })
      
      // Update local state
      if (garden) {
        setGarden({
          ...garden,
          unviewed_milestones: garden.unviewed_milestones.filter(m => m.id !== milestoneId)
        })
      }
    } catch (e: any) {
      console.error('Error marking milestone:', e)
    }
  }

  function showNewMilestones() {
    if (garden && garden.unviewed_milestones.length > 0) {
      // Show the first unviewed milestone
      const milestone = garden.unviewed_milestones[0]
      return milestone
    }
    return null
  }

  return (
    <GardenContext.Provider
      value={{
        garden,
        loading,
        error,
        plantSeed,
        refreshGarden,
        markMilestoneViewed,
        showNewMilestones
      }}
    >
      {children}
    </GardenContext.Provider>
  )
}

export function useGarden() {
  const context = useContext(GardenContext)
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider')
  }
  return context
}
