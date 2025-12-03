/**
 * SoundEngine - Complete audio system for wellness tools
 * 
 * @example
 * ```typescript
 * import { SoundEngine } from './sound-engine';
 * 
 * await SoundEngine.init();
 * await SoundEngine.play('calm', { duration: 5 });
 * ```
 */

// Main engine
export { SoundEngine } from './soundEngine';

// Utilities
export { downloader } from './utils/downloader';
export { audioHelpers } from './utils/audioHelpers';
export { haptics } from './utils/haptics';

// Types and constants
export * from './types';

// Re-export specific types
export type {
  ToolName,
  SoundName,
  SessionDuration,
  PlayMode,
  PlayOptions,
  UserPreferences,
  MultiFlowStep,
} from './soundEngine';
