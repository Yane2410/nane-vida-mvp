import { useState, memo } from 'react'
import {
  CalmMoodIcon,
  AnxiousMoodIcon,
  SadMoodIcon,
  TiredMoodIcon,
  NeutralMoodIcon,
  HappyMoodIcon,
} from '../../assets/icons'

export type Mood = 'calm' | 'anxious' | 'sad' | 'tired' | 'neutral' | 'happy'

interface MoodOption {
  id: Mood
  label: string
  color: string
  Icon: typeof CalmMoodIcon
}

const moods: MoodOption[] = [
  { id: 'calm', label: 'Calmo', color: '#8B5CF6', Icon: CalmMoodIcon },
  { id: 'anxious', label: 'Ansioso', color: '#FBBF24', Icon: AnxiousMoodIcon },
  { id: 'sad', label: 'Triste', color: '#7DD3FC', Icon: SadMoodIcon },
  { id: 'tired', label: 'Cansado', color: '#A78BFA', Icon: TiredMoodIcon },
  { id: 'neutral', label: 'Neutral', color: '#9CA3AF', Icon: NeutralMoodIcon },
  { id: 'happy', label: 'Alegre', color: '#34D399', Icon: HappyMoodIcon },
]

interface MoodSelectorProps {
  value?: Mood
  onChange?: (mood: Mood) => void
  className?: string
}

const MoodSelector = memo(function MoodSelector({ value, onChange, className = '' }: MoodSelectorProps) {
  const [selected, setSelected] = useState<Mood | undefined>(value)
  const [hoveredMood, setHoveredMood] = useState<Mood | null>(null)

  const handleSelect = (mood: Mood) => {
    setSelected(mood)
    onChange?.(mood)
  }

  return (
    <div className={`mood-selector ${className}`}>
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        {moods.map(({ id, label, color, Icon }) => {
          const isSelected = selected === id
          const isHovered = hoveredMood === id

          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              onMouseEnter={() => setHoveredMood(id)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`
                mood-option
                flex flex-col items-center gap-3 p-4 sm:p-6
                rounded-2xl sm:rounded-3xl
                transition-all duration-300 interactive
                ${isSelected ? 'ring-4 ring-offset-2 shadow-medium dark:ring-offset-gray-900' : 'shadow-soft'}
              `}
              style={{
                backgroundColor: isSelected || isHovered ? `${color}15` : (document.documentElement.classList.contains('dark') ? '#1f2937' : '#FFFFFF'),
                transform: isHovered || isSelected ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: isHovered || isSelected
                  ? `0 12px 32px ${color}30`
                  : '0 2px 8px rgba(167, 139, 250, 0.08)',
                ...(isSelected && {
                  '--tw-ring-color': color,
                } as any),
              }}
            >
              <Icon size={isHovered || isSelected ? 56 : 48} color={color} />
              <span
                className={`
                  text-sm sm:text-base font-semibold
                  transition-colors duration-300
                  ${isSelected ? '' : 'text-black dark:text-gray-100'}
                `}
                style={{ color: isSelected ? color : undefined }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {selected && (
        <div
          className="mt-6 p-4 rounded-2xl text-center animate-fadeIn"
          style={{
            backgroundColor: `${moods.find((m) => m.id === selected)?.color}15`,
          }}
        >
          <p className="text-black dark:text-gray-100 text-small">
            Gracias por compartir cómo te sientes. Recuerda que está bien sentirse así.
          </p>
        </div>
      )}
    </div>
  )
})

export default MoodSelector
