import { useState } from 'react'
import {
  CalmMoodIcon,
  AnxiousMoodIcon,
  SadMoodIcon,
  TiredMoodIcon,
  NeutralMoodIcon,
  HappyMoodIcon,
} from '../../assets/icons'

type Mood = 'calm' | 'anxious' | 'sad' | 'tired' | 'neutral' | 'happy'

interface MoodOption {
  id: Mood
  label: string
  color: string
  Icon: typeof CalmMoodIcon
}

const moods: MoodOption[] = [
  { id: 'calm', label: 'Calmo', color: '#A78BFA', Icon: CalmMoodIcon },
  { id: 'anxious', label: 'Ansioso', color: '#FED7AA', Icon: AnxiousMoodIcon },
  { id: 'sad', label: 'Triste', color: '#7DD3FC', Icon: SadMoodIcon },
  { id: 'tired', label: 'Cansado', color: '#C4B5FD', Icon: TiredMoodIcon },
  { id: 'neutral', label: 'Neutral', color: '#BBBBBB', Icon: NeutralMoodIcon },
  { id: 'happy', label: 'Alegre', color: '#BBF7D0', Icon: HappyMoodIcon },
]

interface MoodSelectorProps {
  value?: Mood
  onChange?: (mood: Mood) => void
  className?: string
}

export default function MoodSelector({ value, onChange, className = '' }: MoodSelectorProps) {
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
                transition-all duration-300
                ${isSelected ? 'ring-4 ring-offset-2' : ''}
                ${isHovered ? 'scale-105' : 'scale-100'}
                active:scale-95
              `}
              style={{
                backgroundColor: isSelected || isHovered ? `${color}15` : '#FFFFFF',
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
                  ${isSelected ? '' : 'text-gray-600'}
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
          <p className="text-gray-600 text-sm sm:text-base">
            Gracias por compartir cómo te sientes. Recuerda que está bien sentirse así.
          </p>
        </div>
      )}
    </div>
  )
}
