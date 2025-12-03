/**
 * Types and Constants for SoundEngine
 */

// Re-export main types for convenience
export type {
  ToolName,
  SoundName,
  SessionDuration,
  PlayMode,
  PlayOptions,
  UserPreferences,
  MultiFlowStep,
} from './soundEngine';

export type {
  DownloadConfig,
} from './utils/downloader';

export type {
  FadeConfig,
} from './utils/audioHelpers';

export type {
  HapticPattern,
} from './utils/haptics';

// Pre-defined multi-flow sessions
export const PRESET_SESSIONS = {
  'quick-calm': [
    { tool: 'breath' as const, duration: 2 as const },
    { tool: 'calm' as const, duration: 3 as const },
  ],
  'full-relax': [
    { tool: 'breath' as const, duration: 3 as const },
    { tool: 'calm' as const, duration: 5 as const },
    { tool: 'reflection' as const, duration: 5 as const },
  ],
  'grounding-session': [
    { tool: 'grounding' as const, duration: 5 as const },
    { tool: 'reflection' as const, duration: 5 as const },
  ],
  'complete-wellness': [
    { tool: 'breath' as const, duration: 2 as const },
    { tool: 'calm' as const, duration: 3 as const },
    { tool: 'grounding' as const, duration: 3 as const },
    { tool: 'reflection' as const, duration: 2 as const },
  ],
} as const;

// Sound metadata
export const SOUND_METADATA = {
  'calming-pad': {
    name: 'Calming Pad',
    description: 'Ambient synth pad for deep relaxation',
    duration: 'Loop',
    bpm: 60,
  },
  'soft-meditation': {
    name: 'Soft Meditation',
    description: 'Gentle meditation background',
    duration: 'Loop',
    bpm: 55,
  },
  'deep-breath-pulse': {
    name: 'Deep Breath Pulse',
    description: 'Rhythmic breathing guide',
    duration: 'Loop',
    bpm: 50,
  },
  'ambient-nature': {
    name: 'Ambient Nature',
    description: 'Natural forest sounds with ambience',
    duration: 'Loop',
    bpm: null,
  },
  'white-noise': {
    name: 'White Noise',
    description: 'Smooth white noise for focus',
    duration: 'Loop',
    bpm: null,
  },
} as const;
