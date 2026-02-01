/**
 * SoundEngine - Professional audio system for wellness tools
 * Features: Local tones, fades, loops, multi-flow sessions
 */

import { createNoiseSession, createToneSession, initAudio, unlockAudio, type ToneSession } from './tones';
import { haptics } from './utils/haptics';

export type ToolName = 'calm' | 'breath' | 'grounding' | 'reflection';
export type SoundName = 'calming-pad' | 'soft-meditation' | 'deep-breath-pulse' | 'ambient-nature' | 'white-noise';
export type SessionDuration = 1 | 3 | 5 | 10; // minutes
export type PlayMode = 'normal' | 'guided-silence' | 'night';

export interface PlayOptions {
  duration?: SessionDuration;
  volume?: number;
  mode?: PlayMode;
  enableHaptics?: boolean;
  onPhaseChange?: (phase: string) => void;
}

export interface UserPreferences {
  toolSounds: Record<ToolName, SoundName>;
  defaultVolume: number;
  nightModeVolume: number;
  enableHaptics: boolean;
  enableSounds: boolean;
}

export interface MultiFlowStep {
  tool: ToolName;
  duration: SessionDuration;
}

type SoundPreset =
  | { kind: 'tone'; frequencies: number[]; wave?: OscillatorType }
  | { kind: 'noise' };

class SoundEngineClass {
  private initialized = false;
  private currentSession: ToneSession | null = null;
  private currentTool: ToolName | null = null;
  private stopTimerId: ReturnType<typeof setTimeout> | null = null;

  private readonly SOUND_PRESETS: Record<SoundName, SoundPreset> = {
    'calming-pad': { kind: 'tone', frequencies: [220, 277], wave: 'sine' },
    'soft-meditation': { kind: 'tone', frequencies: [196, 247], wave: 'triangle' },
    'deep-breath-pulse': { kind: 'tone', frequencies: [110], wave: 'sine' },
    'ambient-nature': { kind: 'tone', frequencies: [164, 220], wave: 'triangle' },
    'white-noise': { kind: 'noise' },
  };

  // Default tool-sound mapping
  private readonly DEFAULT_MAPPING: Record<ToolName, SoundName> = {
    calm: 'calming-pad',
    breath: 'deep-breath-pulse',
    grounding: 'ambient-nature',
    reflection: 'soft-meditation',
  };

  // User preferences
  private preferences: UserPreferences = {
    toolSounds: { ...this.DEFAULT_MAPPING },
    defaultVolume: 0.5,
    nightModeVolume: 0.35,
    enableHaptics: true,
    enableSounds: true,
  };

  /**
   * Initialize the sound engine
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    console.log('[SoundEngine] Initializing...');

    try {
      initAudio();
      this.loadPreferences();
      this.initialized = true;
      console.log('[SoundEngine] Initialized successfully');
    } catch (error) {
      console.error('[SoundEngine] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Download all sounds (no-op for local tones)
   */
  async downloadAll(): Promise<void> {
    await this.init();
    console.log('[SoundEngine] No remote sounds to download');
  }

  /**
   * Play sound for a specific tool
   */
  async play(tool: ToolName, options: PlayOptions = {}): Promise<void> {
    await this.playInternal(tool, options, true);
  }

  private async playInternal(tool: ToolName, options: PlayOptions, autoStop: boolean): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    const context = initAudio();
    const unlocked = await unlockAudio();
    if (!context || !unlocked) {
      console.warn('[SoundEngine] AudioContext not available');
      return;
    }

    const {
      duration = 5,
      volume,
      mode = 'normal',
      enableHaptics: hapticsEnabled = this.preferences.enableHaptics,
    } = options;

    // Stop any currently playing sound
    this.stop();

    // Check if sounds are enabled
    if (!this.preferences.enableSounds && mode !== 'guided-silence') {
      console.log('[SoundEngine] Sounds disabled, skipping playback');
      return;
    }

    // Guided silence mode - no audio but keep haptics
    if (mode === 'guided-silence') {
      console.log('[SoundEngine] Guided silence mode');
      if (hapticsEnabled) {
        haptics.sessionStart();
      }
      return;
    }

    // Get sound for tool
    const soundName = this.preferences.toolSounds[tool];
    const session = this.createSession(soundName);

    if (!session) {
      console.warn('[SoundEngine] No audio available for', tool);
      return;
    }

    // Calculate volume based on mode
    let targetVolume = volume ?? this.preferences.defaultVolume;
    if (mode === 'night') {
      targetVolume = this.preferences.nightModeVolume;
    }

    // Play with fade in
    this.currentSession = session;
    this.currentTool = tool;

    session.fadeTo(targetVolume, 0.6);

    // Trigger haptics
    if (hapticsEnabled) {
      haptics.sessionStart();
    }

    // Setup duration-based auto-stop
    if (autoStop && duration) {
      if (this.stopTimerId) {
        clearTimeout(this.stopTimerId);
        this.stopTimerId = null;
      }
      this.stopTimerId = setTimeout(() => {
        this.stop();
        if (hapticsEnabled) {
          haptics.sessionEnd();
        }
      }, duration * 60 * 1000);
    }
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (this.stopTimerId) {
      clearTimeout(this.stopTimerId);
      this.stopTimerId = null;
    }
    if (!this.currentSession) return;

    this.currentSession.stop(0.6);
    this.currentSession = null;
    this.currentTool = null;
  }

  /**
   * Fade in current audio
   */
  fadeIn(duration: number = 2, targetVolume?: number): void {
    if (!this.currentSession) return;

    this.currentSession.fadeTo(
      targetVolume ?? this.preferences.defaultVolume,
      duration
    );
  }

  /**
   * Fade out current audio
   */
  fadeOut(duration: number = 2): void {
    if (!this.currentSession) return;

    this.currentSession.stop(duration);
    this.currentSession = null;
    this.currentTool = null;
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    if (!this.currentSession) return;

    this.currentSession.setVolume(Math.max(0, Math.min(1, volume)));
  }

  /**
   * Set sound for a specific tool
   */
  setSoundForTool(tool: ToolName, soundName: SoundName): void {
    this.preferences.toolSounds[tool] = soundName;
    this.savePreferences();
  }

  /**
   * Get available sounds
   */
  getAvailableSounds(): SoundName[] {
    return Object.keys(this.SOUND_PRESETS) as SoundName[];
  }

  /**
   * Get user preferences
   */
  getUserPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  /**
   * Save user preferences
   */
  savePreferences(): void {
    try {
      localStorage.setItem('nane_sound_preferences', JSON.stringify(this.preferences));
      console.log('[SoundEngine] Preferences saved');
    } catch (error) {
      console.error('[SoundEngine] Failed to save preferences:', error);
    }
  }

  /**
   * Load user preferences
   */
  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('nane_sound_preferences');
      if (saved) {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
        console.log('[SoundEngine] Preferences loaded');
      }
    } catch (error) {
      console.error('[SoundEngine] Failed to load preferences:', error);
    }
  }

  /**
   * Multi-flow session builder
   */
  async playMultiFlow(steps: MultiFlowStep[], options: PlayOptions = {}): Promise<void> {
    console.log('[SoundEngine] Starting multi-flow session', steps);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const isLast = i === steps.length - 1;

      // Play current step
      await this.playInternal(step.tool, { ...options, duration: step.duration }, false);

      // Wait for step duration
      await new Promise((resolve) => setTimeout(resolve, step.duration * 60 * 1000));

      // Crossfade to next step if not last
      if (!isLast) {
        const nextStep = steps[i + 1];
        const nextSound = this.preferences.toolSounds[nextStep.tool];
        const nextSession = this.createSession(nextSound);

        if (nextSession && this.currentSession) {
          const targetVolume = options.volume ?? this.preferences.defaultVolume;
          this.currentSession.stop(3);
          nextSession.fadeTo(targetVolume, 3);
          this.currentSession = nextSession;
          this.currentTool = nextStep.tool;
        }
      }
    }

    // End session
    if (options.enableHaptics ?? this.preferences.enableHaptics) {
      haptics.sessionEnd();
    }
  }

  /**
   * Create a tone session for a sound name
   */
  private createSession(soundName: SoundName): ToneSession | null {
    const preset = this.SOUND_PRESETS[soundName];
    if (!preset) return null;

    if (preset.kind === 'noise') {
      return createNoiseSession();
    }

    return createToneSession({
      frequencies: preset.frequencies,
      wave: preset.wave ?? 'sine',
    });
  }

  /**
   * Cleanup and reset
   */
  cleanup(): void {
    this.stop();
    this.initialized = false;
  }
}

export const SoundEngine = new SoundEngineClass();
