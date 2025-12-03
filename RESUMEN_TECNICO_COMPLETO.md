# RESUMEN TÉCNICO COMPLETO - NANE VIDA MVP

**Fecha de generación:** 2025-12-03  
**Versión:** 1.0.5  
**Última actualización:** 2025-12-02

---

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Módulos Existentes](#módulos-existentes)
3. [Funciones Públicas por Archivo](#funciones-públicas-por-archivo)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Context Providers y Estados Globales](#context-providers-y-estados-globales)
6. [Componentes de UI](#componentes-de-ui)
7. [Utilidades y Helpers](#utilidades-y-helpers)
8. [Tipos e Interfaces](#tipos-e-interfaces)
9. [Servicios Externos](#servicios-externos)
10. [Configuraciones Especiales](#configuraciones-especiales)

---

## 1. ARQUITECTURA GENERAL

### Stack Tecnológico

**Frontend:**
- React 18.3.1 + TypeScript 5.5.3
- Vite 5.4.2 (build tool)
- React Router DOM 6.x
- Axios (HTTP client)
- Recharts (gráficos)
- Tailwind CSS 3.x
- Web APIs: IndexedDB, Web Audio API, Vibration API

**Backend:**
- Django 4.2+
- Django REST Framework
- SimpleJWT (autenticación)
- PostgreSQL (producción) / SQLite (desarrollo)

**Despliegue:**
- Frontend: Vercel
- Backend: Railway
- Repositorio: GitHub (Yane2410/nane-vida-mvp)

---

## 2. MÓDULOS EXISTENTES

### 2.1 Estructura de Directorios Frontend

```
nanevida-frontend/src/
├── api.ts                      # Cliente HTTP y autenticación
├── App.tsx                     # Layout principal y navegación
├── main.tsx                    # Punto de entrada React
├── theme.ts                    # Sistema de diseño emocional
├── version.ts                  # Versionado de despliegue
├── styles.css                  # Estilos globales Tailwind
│
├── assets/
│   ├── icons/                  # Íconos SVG emocionales
│   ├── illustrations/          # Ilustraciones (vacío)
│   └── sounds/                 # Audio files (vacío, README presente)
│
├── components/
│   ├── AnimatedCore.tsx        # Sistema de animaciones unificado
│   ├── EditEntryModal.tsx      # Modal de edición de entradas
│   ├── EntryForm.tsx           # Formulario de creación de entradas
│   ├── EntryList.tsx           # Lista de entradas del diario
│   ├── MoodChart.tsx           # Gráficos de estadísticas de ánimo
│   ├── RequireAuth.tsx         # HOC de protección de rutas
│   │
│   └── ui/
│       ├── AppHeader.tsx       # Cabecera de la aplicación
│       ├── Button.tsx          # Botón con variantes emocionales
│       ├── Card.tsx            # Tarjeta con efectos glassmorphism
│       ├── EmotionalCard.tsx   # Tarjeta temática con íconos
│       ├── EmptyState.tsx      # Estado vacío ilustrado
│       ├── Input.tsx           # Input y Textarea con validación
│       ├── LoadingSpinner.tsx  # Indicador de carga
│       ├── MobileMenu.tsx      # Menú hamburguesa responsive
│       └── MoodSelector.tsx    # Selector de estado de ánimo
│
├── pages/
│   ├── Breath.tsx              # Ejercicios de respiración
│   ├── Calm.tsx                # Técnicas de calma rápida
│   ├── Dashboard.tsx           # Panel de estadísticas del usuario
│   ├── Diary.tsx               # Diario emocional
│   ├── Grounding.tsx           # Ejercicios de grounding
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # Inicio de sesión
│   ├── Profile.tsx             # Perfil de usuario
│   ├── Reflection.tsx          # Reflexión guiada
│   ├── Register.tsx            # Registro de usuario
│   ├── Settings.tsx            # Configuración de cuenta
│   ├── SOS.tsx                 # Recursos de emergencia
│   └── Statistics.tsx          # Estadísticas detalladas
│
├── sound-engine/               # ⭐ NUEVO: Motor de audio profesional
│   ├── index.ts                # Barrel export
│   ├── soundEngine.ts          # Clase principal del motor
│   ├── types.ts                # Tipos y presets de sesiones
│   ├── README.md               # Documentación completa (430 líneas)
│   │
│   ├── utils/
│   │   ├── audioHelpers.ts     # Efectos de audio (fades, crossfade)
│   │   ├── downloader.ts       # Descarga y caché IndexedDB
│   │   └── haptics.ts          # Patrones de vibración
│   │
│   └── assets/sounds/          # Directorio para archivos locales
│
└── utils/
    └── soundController.ts      # Sistema de audio básico (legacy)
```

### 2.2 Estructura Backend

```
nanevida-backend/
├── manage.py
├── nane/                       # Configuración Django
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
│
└── core/                       # App principal
    ├── models.py               # Modelos: User, Entry, SOSResource, UserProfile
    ├── views.py                # ViewSets y vistas API
    ├── serializers.py          # Serialización y sanitización XSS
    ├── urls.py                 # Rutas de la API
    ├── permissions.py          # Permisos personalizados
    ├── admin.py                # Panel de administración
    └── migrations/             # Migraciones de base de datos
```

---

## 3. FUNCIONES PÚBLICAS POR ARCHIVO

### 3.1 API y Autenticación (`api.ts`)

```typescript
// Gestión de tokens
export function setTokens(accessToken: string, refreshToken?: string): void
export function getToken(): string | null
export function getRefreshToken(): string | null
export function clearTokens(): void
export function isTokenExpired(token: string): boolean

// Cliente HTTP Axios
export const api: AxiosInstance
// Configuración:
// - baseURL: API_BASE (env VITE_API_BASE o http://127.0.0.1:8000/api)
// - timeout: 30000ms
// - withCredentials: false
// - Interceptores: Auto-attach Bearer token, refresh token automático
```

### 3.2 SoundEngine (`sound-engine/`)

#### `soundEngine.ts` - Motor Principal

```typescript
class SoundEngineClass {
  // Inicialización
  async init(): Promise<void>
  
  // Descarga de sonidos
  async downloadAll(): Promise<Map<SoundName, string>>
  
  // Reproducción
  async play(tool: ToolName, options?: PlayOptions): Promise<void>
  stop(): void
  
  // Control de audio
  fadeIn(duration: number): void
  fadeOut(duration: number): void
  setVolume(volume: number): void
  
  // Configuración
  setSoundForTool(tool: ToolName, soundName: SoundName): void
  getAvailableSounds(): SoundName[]
  
  // Preferencias
  getUserPreferences(): UserPreferences
  savePreferences(preferences: Partial<UserPreferences>): void
  
  // Sesiones multi-flujo
  async playMultiFlow(steps: MultiFlowStep[], options?: Omit<PlayOptions, 'duration'>): Promise<void>
  
  // Limpieza
  cleanup(): void
}

export const SoundEngine: SoundEngineClass // Singleton

// Tipos exportados:
export type ToolName = 'calm' | 'breath' | 'grounding' | 'reflection'
export type SoundName = 'calming-pad' | 'soft-meditation' | 'deep-breath-pulse' | 'ambient-nature' | 'white-noise'
export type SessionDuration = 1 | 3 | 5 | 10 // minutos
export type PlayMode = 'normal' | 'guided-silence' | 'night'

export interface PlayOptions {
  duration?: SessionDuration
  volume?: number
  mode?: PlayMode
  enableHaptics?: boolean
  onPhaseChange?: (phase: string) => void
}

export interface UserPreferences {
  toolSounds: Record<ToolName, SoundName>
  defaultVolume: number
  nightModeVolume: number
  enableHaptics: boolean
  enableSounds: boolean
}

export interface MultiFlowStep {
  tool: ToolName
  duration: SessionDuration
}
```

#### `downloader.ts` - Gestor de Descargas

```typescript
export interface DownloadConfig {
  url: string
  filename: string
  maxRetries?: number
}

export class SoundDownloader {
  // Inicialización IndexedDB
  async init(): Promise<void>
  
  // Gestión de caché
  async exists(filename: string): Promise<boolean>
  async get(filename: string): Promise<Blob | null>
  
  // Descarga con retry
  async download(config: DownloadConfig): Promise<string>
  async downloadAll(configs: DownloadConfig[]): Promise<Map<string, string>>
  
  // Fallback y limpieza
  generateSilentFallback(): string
  async clearCache(): Promise<void>
}

export const downloader: SoundDownloader // Singleton
```

#### `audioHelpers.ts` - Efectos de Audio

```typescript
export interface FadeConfig {
  audio: HTMLAudioElement
  duration: number
  targetVolume: number
  onComplete?: () => void
}

export class AudioHelpers {
  // Fades
  fadeIn(config: FadeConfig): void
  fadeOut(config: FadeConfig): void
  stopFade(audio: HTMLAudioElement): void
  
  // Loops y ducking
  enableSeamlessLoop(audio: HTMLAudioElement): void
  duck(audio: HTMLAudioElement, targetVolume?: number): void
  unduck(audio: HTMLAudioElement, originalVolume?: number): void
  
  // Volumen progresivo
  setProgressiveVolume(audio: HTMLAudioElement, elapsed: number, total: number, baseVolume: number): void
  
  // Crossfade
  async crossfade(fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, duration: number): Promise<void>
  
  // Limpieza
  cleanup(): void
}

export const audioHelpers: AudioHelpers // Singleton
```

#### `haptics.ts` - Vibración

```typescript
export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

export class Haptics {
  // Disponibilidad
  isAvailable(): boolean
  
  // Patrones predefinidos
  trigger(pattern: HapticPattern): void
  
  // Patrones para respiración
  breathPattern(phase: 'inhale' | 'hold' | 'exhale'): void
  
  // Patrones para herramientas
  stepComplete(): void
  newPrompt(): void
  techniqueTransition(): void
  
  // Sesiones
  sessionStart(): void
  sessionEnd(): void
  
  // Personalizado
  custom(pattern: number | number[]): void
  stop(): void
}

export const haptics: Haptics // Singleton
```

#### `types.ts` - Presets

```typescript
export const PRESET_SESSIONS = {
  'quick-calm': [
    { tool: 'breath', duration: 2 },
    { tool: 'calm', duration: 3 }
  ],
  'full-relax': [
    { tool: 'breath', duration: 3 },
    { tool: 'calm', duration: 5 },
    { tool: 'reflection', duration: 5 }
  ],
  'grounding-session': [
    { tool: 'grounding', duration: 5 },
    { tool: 'reflection', duration: 5 }
  ],
  'complete-wellness': [
    { tool: 'breath', duration: 2 },
    { tool: 'calm', duration: 3 },
    { tool: 'grounding', duration: 3 },
    { tool: 'reflection', duration: 2 }
  ]
} as const

export const SOUND_METADATA = {
  'calming-pad': { name: 'Calming Pad', description: '...', duration: 'Loop', bpm: 60 },
  'soft-meditation': { name: 'Soft Meditation', description: '...', duration: 'Loop', bpm: 55 },
  'deep-breath-pulse': { name: 'Deep Breath Pulse', description: '...', duration: 'Loop', bpm: 50 },
  'ambient-nature': { name: 'Ambient Nature', description: '...', duration: 'Loop', bpm: null },
  'white-noise': { name: 'White Noise', description: '...', duration: 'Loop', bpm: null }
} as const
```

### 3.3 SoundController Legacy (`utils/soundController.ts`)

```typescript
type SoundName = 'wind' | 'bell' | 'water' | 'breath'

class SoundController {
  async playLoop(soundName: SoundName, volume?: number): Promise<void>
  async playOnce(soundName: SoundName, volume?: number): Promise<void>
  stop(soundName: SoundName): void
  stopAll(): void
  stopAllLoops(): void
  cleanup(): void
}

export const soundController: SoundController // Singleton
```

### 3.4 Componentes Principales

#### `AnimatedCore.tsx` - Sistema de Animaciones

```typescript
interface AnimatedCoreProps {
  children: ReactNode
  mode?: 'pulse' | 'breath' | 'stepHighlight' | 'fadeIn'
  scaleRange?: [number, number]
  duration?: number
  loop?: boolean
  delay?: number
  onStep?: () => void
  className?: string
}

export default function AnimatedCore(props: AnimatedCoreProps): JSX.Element
```

#### `RequireAuth.tsx` - Protección de Rutas

```typescript
export default function RequireAuth({ children }: { children: JSX.Element }): JSX.Element
// Redirige a /login si no hay token
```

#### Componentes UI

```typescript
// Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: ReactNode
  isLoading?: boolean
  children: ReactNode
}
export default function Button(props: ButtonProps): JSX.Element

// Card.tsx
interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  animated?: boolean
  style?: CSSProperties
}
export default function Card(props: CardProps): JSX.Element

// EmotionalCard.tsx
interface EmotionalCardProps {
  title: string
  description: string
  icon: ReactNode
  color: string
  onClick?: () => void
  href?: string
  className?: string
}
export default function EmotionalCard(props: EmotionalCardProps): JSX.Element

// Input.tsx
interface InputProps {
  label?: string
  error?: string
  icon?: ReactNode
  // + HTMLInputAttributes
}
export const Input: ForwardRefExoticComponent<InputProps>
export const Textarea: ForwardRefExoticComponent<TextareaProps>

// MobileMenu.tsx
interface MobileMenuProps {
  isAuth: boolean
  onLogout: (e: React.MouseEvent) => void
}
export default function MobileMenu(props: MobileMenuProps): JSX.Element

// MoodSelector.tsx
export type Mood = 'calm' | 'anxious' | 'sad' | 'tired' | 'neutral' | 'happy'
interface MoodSelectorProps {
  value?: Mood
  onChange?: (mood: Mood) => void
  className?: string
}
export default function MoodSelector(props: MoodSelectorProps): JSX.Element

// LoadingSpinner.tsx
interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}
export default function LoadingSpinner(props: LoadingSpinnerProps): JSX.Element

// EmptyState.tsx
interface EmptyStateProps {
  emoji?: string
  title: string
  message?: string
  action?: ReactNode
}
export default function EmptyState(props: EmptyStateProps): JSX.Element

// AppHeader.tsx
export default function AppHeader(): JSX.Element
```

#### Componentes de Diario

```typescript
// EntryForm.tsx
interface EntryFormProps {
  onSave: (data: {
    title: string
    content: string
    emoji?: string
    mood?: string
  }) => void
}
export default function EntryForm(props: EntryFormProps): JSX.Element

// EntryList.tsx
interface Entry {
  id: number
  title: string
  content: string
  emoji: string
  mood: string
  created_at: string
  updated_at: string
}
interface EntryListProps {
  entries: Entry[]
  onEdit: (entry: Entry) => void
  onDelete: (id: number) => void
}
export default function EntryList(props: EntryListProps): JSX.Element

// EditEntryModal.tsx
interface EditEntryModalProps {
  entry: Entry | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Entry>) => void
}
export default function EditEntryModal(props: EditEntryModalProps): JSX.Element

// MoodChart.tsx
export default function MoodChart(): JSX.Element
// Usa recharts: BarChart, LineChart, PieChart
// Carga estadísticas desde /api/mood-stats/
```

### 3.5 Páginas

Todas las páginas son componentes sin props que exportan `default function PageName(): JSX.Element`

**Páginas existentes:**
- `Breath.tsx` - Ejercicios de respiración con patrones 4-4-4 y 4-7-8
- `Calm.tsx` - 4 técnicas de calma rápida (visualización, respiración, relajación muscular)
- `Dashboard.tsx` - Estadísticas del usuario y accesos rápidos
- `Diary.tsx` - CRUD de entradas del diario emocional
- `Grounding.tsx` - Técnicas de grounding (5-4-3-2-1)
- `Home.tsx` - Landing con selector de mood y herramientas
- `Login.tsx` - Formulario de inicio de sesión
- `Profile.tsx` - Visualización/edición de perfil
- `Reflection.tsx` - Preguntas de reflexión guiada
- `Register.tsx` - Formulario de registro
- `Settings.tsx` - Configuración de cuenta
- `SOS.tsx` - Recursos de emergencia y líneas de ayuda
- `Statistics.tsx` - Estadísticas detalladas con gráficos

### 3.6 Assets/Icons

```typescript
// Todos los íconos tienen la misma firma:
export const IconName = ({ 
  size = 24, 
  color = 'currentColor' 
}) => JSX.Element

// Íconos disponibles:
export const HeartIcon
export const BreathIcon
export const CalmIcon
export const JournalIcon
export const SparkleIcon
export const FlowerIcon
export const CloudIcon
export const StarIcon
export const MoonIcon
export const SunIcon
export const TreeIcon
export const MountainIcon

// Íconos de mood:
export const CalmMoodIcon
export const AnxiousMoodIcon
export const SadMoodIcon
export const TiredMoodIcon
export const NeutralMoodIcon
export const HappyMoodIcon
```

### 3.7 Theme (`theme.ts`)

```typescript
export const theme = {
  colors: {
    background: { primary: '#F7F5FF', white: '#FDFCFB', card: '#FFFFFF' },
    primary: { main: '#A78BFA', light: '#C4B5FD', dark: '#8B5CF6' },
    secondary: { main: '#7DD3FC', light: '#BAE6FD', dark: '#38BDF8' },
    support: { pink: '#FBCFE8', green: '#BBF7D0', yellow: '#FEF3C7', orange: '#FED7AA' },
    text: { primary: '#333333', secondary: '#555555', tertiary: '#777777', white: '#FFFFFF' },
    states: { success: '#BBF7D0', warning: '#FEF3C7', error: '#FECACA', info: '#BFDBFE' }
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  borderRadius: { sm: '8px', md: '16px', lg: '24px', xl: '32px', full: '9999px' },
  shadows: {
    sm: '0 2px 8px rgba(167, 139, 250, 0.08)',
    md: '0 8px 32px rgba(167, 139, 250, 0.15)',
    lg: '0 12px 48px rgba(167, 139, 250, 0.25)',
    glow: '0 0 24px rgba(167, 139, 250, 0.4)'
  },
  transitions: {
    fast: '150ms ease-out',
    normal: '300ms ease-out',
    slow: '500ms ease-out'
  }
}
```

---

## 4. HOOKS PERSONALIZADOS

**No existen hooks personalizados en el proyecto actualmente.**

Todos los componentes usan hooks nativos de React:
- `useState`
- `useEffect`
- `useNavigate` (React Router)
- `useLocation` (React Router)

---

## 5. CONTEXT PROVIDERS Y ESTADOS GLOBALES

**No existen Context Providers en el proyecto.**

**Gestión de estado:**
- **Autenticación:** LocalStorage con tokens JWT (`nane_token`, `nane_refresh_token`)
- **Preferencias de usuario (SoundEngine):** LocalStorage (`nane_sound_preferences`)
- **Audio caché:** IndexedDB (`NaneVidaSounds` database)
- **Estado de UI:** useState local en cada componente

**No se usa:**
- Redux
- Context API
- Zustand
- Jotai
- React Query/TanStack Query

---

## 6. COMPONENTES DE UI

### 6.1 Sistema de Diseño

**Paleta Emocional:**
- Lila/Púrpura (`#A78BFA`) - Calma, serenidad
- Celeste (`#7DD3FC`) - Paz, tranquilidad
- Rosa pastel (`#FBCFE8`) - Amor propio, cuidado
- Verde suave (`#BBF7D0`) - Crecimiento, esperanza
- Amarillo suave (`#FEF3C7`) - Optimismo
- Naranja suave (`#FED7AA`) - Energía gentil

**Efectos:**
- Glassmorphism: `backdrop-blur-xl bg-white/70`
- Gradientes emocionales
- Sombras suaves con color tintado
- Bordes redondeados (16-32px)
- Transiciones suaves (300ms)

### 6.2 Componentes Disponibles

1. **Button** - 5 variantes (primary, secondary, ghost, danger, success), 3 tamaños
2. **Card** - Glassmorphism, hover, gradient, animated
3. **EmotionalCard** - Tarjeta temática con ícono y color
4. **Input/Textarea** - Con label, error, icon
5. **MoodSelector** - 6 moods con íconos animados
6. **MobileMenu** - Portal hamburger menu (z-index 9999)
7. **LoadingSpinner** - Spinner con texto opcional
8. **EmptyState** - Estado vacío ilustrado
9. **AppHeader** - Cabecera con título y subtítulo
10. **AnimatedCore** - 4 modos de animación (pulse, breath, stepHighlight, fadeIn)

### 6.3 Jerarquía de z-index

```
z-[9999] - MobileMenu panel
z-[9998] - MobileMenu overlay
z-50     - App header (sticky)
z-10     - Cards con hover
z-0      - Base layer
```

---

## 7. UTILIDADES Y HELPERS

### 7.1 SoundController Legacy

- `playLoop(soundName, volume)` - Loop infinito
- `playOnce(soundName, volume)` - Reproducción única
- `stop(soundName)` - Detiene un sonido
- `stopAll()` - Detiene todos los sonidos
- `cleanup()` - Limpieza de recursos

**Sonidos esperados:**
- `/sounds/wind.mp3`
- `/sounds/bell.mp3`
- `/sounds/water.mp3`
- `/sounds/breath-tone.mp3`

### 7.2 SoundEngine (Nuevo)

Ver sección 3.2 para API completa.

**Características:**
- Auto-descarga de 5 sonidos desde URLs externas
- Caché IndexedDB persistente
- Retry con exponential backoff (2 intentos)
- Fallback silencioso si falla descarga
- Efectos: fadeIn (2s), fadeOut (2-4s), crossfade, ducking, seamless loops
- Haptics: 13 patrones de vibración
- 3 modos: normal, guided-silence, night
- 4 duraciones: 1/3/5/10 minutos
- Preferencias persistentes (localStorage)
- Multi-flow sessions con transiciones

**URLs de sonidos:**
1. `calming-pad.mp3` - Free Music Archive (Broke For Free - Night Owl)
2. `soft-meditation.mp3` - Free Music Archive (Lee Rosevere - Were The Stars Eyes)
3. `deep-breath-pulse.mp3` - Pixabay audio
4. `ambient-nature.mp3` - Pixabay audio
5. `white-noise.mp3` - Pixabay audio

### 7.3 API Client

- Axios configurado con base URL dinámica
- Interceptores automáticos para Bearer token
- Auto-refresh de token JWT en 401
- Rate limiting headers
- Timeout de 30 segundos

---

## 8. TIPOS E INTERFACES

### 8.1 Autenticación

```typescript
// api.ts
interface InternalAxiosRequestConfig // Axios config extendido
```

### 8.2 Diario

```typescript
// EntryList.tsx, MoodChart.tsx
interface Entry {
  id: number
  title: string
  content: string
  emoji: string
  mood: string
  created_at: string
  updated_at: string
}

type Mood = 'very_happy' | 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry'

interface MoodStats {
  mood_counts: Record<string, number>
  mood_timeline: Array<{ date: string; mood: string; title: string }>
  total_entries: number
  days: number
}
```

### 8.3 Dashboard

```typescript
// Dashboard.tsx
interface DashboardStats {
  total_entries: number
  entries_this_week: number
  entries_this_month: number
  streak_days: number
  average_mood?: string
  last_entry_date?: string
}

interface UserProfile {
  username: string
  email: string
  bio: string
  avatar: string | null
  created_at: string
}
```

### 8.4 Respiración

```typescript
// Breath.tsx
type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

interface BreathCycle {
  phase: BreathPhase
  duration: number
  instruction: string
}
```

### 8.5 SoundEngine

Ver sección 3.2 para tipos completos:
- `ToolName`, `SoundName`, `SessionDuration`, `PlayMode`
- `PlayOptions`, `UserPreferences`, `MultiFlowStep`
- `DownloadConfig`, `FadeConfig`, `HapticPattern`

---

## 9. SERVICIOS EXTERNOS

### 9.1 Backend API (Django REST)

**Base URL:** `process.env.VITE_API_BASE` o `http://127.0.0.1:8000/api`

**Endpoints disponibles:**

```
Authentication:
POST   /api/token/              - Login (JWT access + refresh)
POST   /api/token/refresh/      - Refresh access token
POST   /api/register/           - Registro de usuario

User:
GET    /api/profile/            - Ver perfil
PUT    /api/profile/            - Actualizar perfil
PATCH  /api/profile/            - Actualizar parcial

Diary:
GET    /api/entries/            - Listar entradas
POST   /api/entries/            - Crear entrada
GET    /api/entries/{id}/       - Ver entrada
PUT    /api/entries/{id}/       - Actualizar entrada
DELETE /api/entries/{id}/       - Eliminar entrada
GET    /api/entries/stats/      - Estadísticas de entradas

Mood:
GET    /api/mood-stats/?days=30 - Estadísticas de ánimo

SOS:
GET    /api/sos/                - Recursos de emergencia
```

**Autenticación:**
- Header: `Authorization: Bearer {access_token}`
- Refresh automático en 401
- Rate limiting: 5 login/min, 10 entradas/min

**Rate Limiting:**
- Login: 5 intentos/minuto (anónimo)
- Creación de entradas: 10/minuto (autenticado)

### 9.2 Sonidos Externos (SoundEngine)

**Free Music Archive:**
- Broke For Free - Night Owl
- Lee Rosevere - Were The Stars Eyes

**Pixabay:**
- 3 archivos de audio (breath-pulse, ambient-nature, white-noise)

**Caché local:** IndexedDB `NaneVidaSounds`

### 9.3 Despliegue

**Frontend (Vercel):**
- Auto-deploy en push a `main`
- Build command: `npm run build`
- Output directory: `dist`

**Backend (Railway):**
- PostgreSQL database
- Auto-deploy en push a `main`

---

## 10. CONFIGURACIONES ESPECIALES

### 10.1 IndexedDB

**Base de datos:** `NaneVidaSounds`  
**Versión:** 1  
**Object Store:** `audio_files`  
**Clave primaria:** `filename`

**Esquema:**
```typescript
{
  filename: string    // Nombre del archivo
  blob: Blob         // Audio data
  timestamp: number  // Fecha de descarga
}
```

**Uso:**
- Caché persistente de sonidos descargados
- Sobrevive refrescos de página
- Almacenamiento ~5-15MB por usuario
- Limpieza manual con `downloader.clearCache()`

### 10.2 LocalStorage

**Claves usadas:**

1. `nane_token` - JWT access token
2. `nane_refresh_token` - JWT refresh token
3. `nane_sound_preferences` - Preferencias de SoundEngine

**Esquema de preferencias:**
```typescript
{
  toolSounds: {
    calm: 'calming-pad',
    breath: 'deep-breath-pulse',
    grounding: 'ambient-nature',
    reflection: 'soft-meditation'
  },
  defaultVolume: 0.5,
  nightModeVolume: 0.35,
  enableHaptics: true,
  enableSounds: true
}
```

### 10.3 Web Audio API

**Uso en soundController (legacy):**
- HTMLAudioElement para reproducción
- Control de volumen (0-1)
- Loop infinito con `audio.loop = true`

**Uso en SoundEngine:**
- HTMLAudioElement para reproducción
- AudioContext para generación de fallback silencioso
- Fade effects con setInterval (50ms updates)
- Seamless loops con timeupdate listener
- Crossfade con Promise.all

### 10.4 Vibration API

**Disponibilidad:** `'vibrate' in navigator`

**Patrones implementados:**
```typescript
light: 10ms
medium: 20ms
heavy: 50ms
success: [10, 50, 10]
warning: [20, 100, 20]
error: [50, 100, 50, 100, 50]

// Respiración:
inhale: [20, 100, 20]
hold: 10
exhale: [30, 150, 30]

// Sesiones:
sessionStart: [50, 100, 50, 100, 100]
sessionEnd: [100, 50, 100, 50, 200]
```

### 10.5 React Router

**Configuración:**
```typescript
createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    
    // Rutas protegidas (RequireAuth):
    { path: 'dashboard', element: <RequireAuth><Dashboard /></RequireAuth> },
    { path: 'diary', element: <RequireAuth><Diary /></RequireAuth> },
    { path: 'statistics', element: <RequireAuth><Statistics /></RequireAuth> },
    { path: 'settings', element: <RequireAuth><Settings /></RequireAuth> },
    { path: 'profile', element: <RequireAuth><Profile /></RequireAuth> },
    
    // Rutas públicas:
    { path: 'sos', element: <SOS /> },
    { path: 'calm', element: <Calm /> },
    { path: 'breath', element: <Breath /> },
    { path: 'reflection', element: <Reflection /> },
    { path: 'grounding', element: <Grounding /> }
  ]}
])
```

### 10.6 Tailwind CSS

**Configuración:**
- Paleta personalizada con colores emocionales
- Breakpoints estándar (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Animaciones personalizadas: fadeIn, scaleIn, slideInRight
- Typography plugin
- Forms plugin

### 10.7 Vite

**Variables de entorno:**
- `VITE_API_BASE` - URL del backend (default: http://127.0.0.1:8000/api)
- `VITE_API_TIMEOUT` - Timeout HTTP (default: 30000ms)

**Build output:**
- dist/index.html
- dist/assets/*.css
- dist/assets/*.js
- Chunks: react-vendor, axios-vendor

### 10.8 Django Backend

**Modelos:**
```python
User (Django default)
  - username, email, password

UserProfile
  - user (OneToOne)
  - bio, avatar
  - created_at, updated_at

Entry
  - owner (ForeignKey User)
  - title, content, emoji
  - mood (choices: very_happy, happy, neutral, sad, anxious, angry)
  - created_at, updated_at

SOSResource
  - title, type (CALL/LINK/TEXT)
  - url, priority, active
```

**Autenticación:**
- Django REST Framework + SimpleJWT
- Access token: 60 minutos
- Refresh token: 7 días

**Seguridad:**
- CORS configurado para frontend
- Sanitización XSS en serializers (bleach)
- Rate limiting en login y creación de entradas
- Validación de password en registro

---

## 📊 ESTADÍSTICAS DEL PROYECTO

**Archivos:**
- Frontend: 45 archivos TypeScript/JSX
- Backend: 18 archivos Python
- Documentación: 10 archivos Markdown

**Líneas de código (aproximado):**
- Frontend: ~8,000 líneas
- Backend: ~1,500 líneas
- SoundEngine: 1,336 líneas (nuevo)

**Componentes React:** 26  
**Páginas:** 13  
**Hooks personalizados:** 0  
**Context Providers:** 0

**Endpoints API:** 11  
**Modelos Django:** 3

---

## 🔧 COMANDOS ÚTILES

```bash
# Frontend
cd nanevida-frontend
npm install
npm run dev          # Desarrollo (localhost:5173)
npm run build        # Compilar para producción
npm run preview      # Preview de build

# Backend
cd nanevida-backend
python manage.py runserver      # Desarrollo (localhost:8000)
python manage.py migrate        # Aplicar migraciones
python manage.py createsuperuser # Admin panel

# Git
git add .
git commit -m "mensaje"
git push origin main
```

---

## ✅ ESTADO ACTUAL

**Último commit:** d58775e - feat: Add comprehensive SoundEngine module  
**Último deploy:** 2025-12-02

**Funcionalidades activas:**
- ✅ Autenticación JWT con refresh automático
- ✅ CRUD de entradas de diario
- ✅ Estadísticas de ánimo con gráficos
- ✅ Perfil de usuario con avatar
- ✅ 4 herramientas de bienestar (Breath, Calm, Reflection, Grounding)
- ✅ Recursos SOS
- ✅ Sistema de animaciones unificado (AnimatedCore)
- ✅ Audio básico con soundController
- ✅ **SoundEngine profesional** (auto-download, caché, efectos, haptics)
- ✅ Menú móvil responsive
- ✅ Diseño emocional con Tailwind

**Pendiente:**
- 🔄 Integrar SoundEngine en herramientas de bienestar (reemplazar soundController)
- 🔄 Pruebas con sonidos descargados desde URLs externas
- 🔄 Optimización de performance en móviles
- 🔄 Tests unitarios (frontend y backend)

---

## 📝 NOTAS IMPORTANTES

1. **SoundEngine es el sistema más reciente** (commit d58775e). soundController es legacy y será reemplazado.

2. **No existen hooks personalizados ni Context API** - Toda la gestión de estado es local o mediante APIs del navegador.

3. **IndexedDB es crítico** para el funcionamiento del SoundEngine. Los sonidos se descargan una vez y se cachean permanentemente.

4. **La autenticación es stateless** - JWT en localStorage, sin cookies ni sesiones de servidor.

5. **El diseño es mobile-first** - Breakpoint crítico en md:768px para hamburger menu.

6. **Haptics solo funciona en móviles** con soporte de Vibration API (Android Chrome, iOS Safari limitado).

7. **CORS está configurado** en el backend para permitir requests desde el frontend de Vercel.

8. **Rate limiting protege** los endpoints sensibles (login, registro, creación de entradas).

---

**FIN DEL RESUMEN TÉCNICO COMPLETO**
