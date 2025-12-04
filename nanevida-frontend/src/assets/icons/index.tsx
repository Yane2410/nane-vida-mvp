// 🎨 Íconos SVG emocionales para NANE VIDA

export const HeartIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const BreathIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <circle cx="12" cy="12" r="3" fill={color} />
  </svg>
)

export const CalmIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12h4l3-9 4 18 3-9h4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const JournalIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const SparkleIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
      fill={color}
    />
    <path
      d="M19 3L19.5 5L21.5 5.5L19.5 6L19 8L18.5 6L16.5 5.5L18.5 5L19 3Z"
      fill={color}
    />
    <path
      d="M19 16L19.5 18L21.5 18.5L19.5 19L19 21L18.5 19L16.5 18.5L18.5 18L19 16Z"
      fill={color}
    />
  </svg>
)

export const MoonIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const SunIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none" />
    <line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const CloudIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

export const FlowerIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill={color} />
    <path
      d="M12 3C10.5 3 9.5 4.5 9.5 6.5C9.5 5 8 4 6.5 4C8 4 9.5 5.5 9.5 7C9.5 5.5 8.5 4 7 3.5C8.5 4 9.5 5.5 9.5 7C9.5 8.5 8 9.5 6.5 9.5C8 9.5 9.5 11 9.5 12.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M12 21C13.5 21 14.5 19.5 14.5 17.5C14.5 19 16 20 17.5 20C16 20 14.5 18.5 14.5 17C14.5 18.5 15.5 20 17 20.5C15.5 20 14.5 18.5 14.5 17C14.5 15.5 16 14.5 17.5 14.5C16 14.5 14.5 13 14.5 11.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

// Estados emocionales
export const CalmMoodIcon = ({ size = 48, color = '#A78BFA' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <circle cx="16" cy="20" r="2" fill={color} />
    <circle cx="32" cy="20" r="2" fill={color} />
    <path
      d="M16 28C16 28 19 32 24 32C29 32 32 28 32 28"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

export const AnxiousMoodIcon = ({ size = 48, color = '#FED7AA' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <path d="M15 19L17 21L15 23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M33 19L31 21L33 23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M16 30C16 30 18 27 24 27C30 27 32 30 32 30"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

export const SadMoodIcon = ({ size = 48, color = '#7DD3FC' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <circle cx="16" cy="20" r="2" fill={color} />
    <circle cx="32" cy="20" r="2" fill={color} />
    <path
      d="M16 32C16 32 19 28 24 28C29 28 32 32 32 32"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M18 18L15 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M30 18L33 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const TiredMoodIcon = ({ size = 48, color = '#C4B5FD' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <line x1="14" y1="21" x2="18" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="30" y1="21" x2="34" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="24" cy="30" rx="4" ry="2" fill={color} />
  </svg>
)

export const NeutralMoodIcon = ({ size = 48, color = '#BBBBBB' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <circle cx="16" cy="20" r="2" fill={color} />
    <circle cx="32" cy="20" r="2" fill={color} />
    <line x1="16" y1="30" x2="32" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

export const HappyMoodIcon = ({ size = 48, color = '#BBF7D0' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
    <circle cx="24" cy="24" r="18" fill={color} opacity="0.3" />
    <circle cx="16" cy="20" r="2" fill={color} />
    <circle cx="32" cy="20" r="2" fill={color} />
    <path
      d="M16 27C16 27 19 33 24 33C29 33 32 27 32 27"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)
