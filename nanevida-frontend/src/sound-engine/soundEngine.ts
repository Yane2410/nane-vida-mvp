/**
 * SoundEngine - Professional audio system for wellness tools
 * Features: Auto-download, caching, fades, loops, multi-flow sessions
 */

import { downloader, type DownloadConfig } from './utils/downloader';
import { audioHelpers } from './utils/audioHelpers';
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

class SoundEngineClass {
  private initialized = false;
  private currentAudio: HTMLAudioElement | null = null;
  private currentTool: ToolName | null = null;
  private soundUrls = new Map<SoundName, string>();
  private audioCache = new Map<SoundName, HTMLAudioElement>();
  
  // Sound source URLs
  private readonly SOUND_SOURCES: DownloadConfig[] = [
    {
      url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
      filename: 'calming-pad.mp3',
    },
    {
      url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Lee_Rosevere/10_Minutes_of_Meditation/Lee_Rosevere_-_01_-_Were_The_Stars_Eyes.mp3',
      filename: 'soft-meditation.mp3',
    },
    {
      url: 'https://cdn.pixabay.com/download/audio/2021/09/01/audio_4dc9415d22.mp3',
      filename: 'deep-breath-pulse.mp3',
    },
    {
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8f87ecfece.mp3',
      filename: 'ambient-nature.mp3',
    },
    {
      url: 'https://cdn.pixabay.com/download/audio/2021/09/30/audio_1a1c3bbf27.mp3',
      filename: 'white-noise.mp3',
    },
  ];

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
      // Initialize downloader
      await downloader.init();

      // Load user preferences from localStorage
      this.loadPreferences();

      this.initialized = true;
      console.log('[SoundEngine] Initialized successfully');
    } catch (error) {
      console.error('[SoundEngine] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Download all sounds (can be called on first load or manually)
   */
  async downloadAll(): Promise<void> {
    console.log('[SoundEngine] Downloading all sounds...');

    const urlMap = await downloader.downloadAll(this.SOUND_SOURCES);

    // Store URLs
    urlMap.forEach((url, filename) => {
      const soundName = filename.replace('.mp3', '') as SoundName;
      this.soundUrls.set(soundName, url);
    });

    console.log('[SoundEngine] All sounds downloaded');
  }

  /**
   * Play sound for a specific tool
   */
  async play(tool: ToolName, options: PlayOptions = {}): Promise<void> {
    if (!this.initialized) {
      await this.init();
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
    const audio = await this.getOrCreateAudio(soundName);

    if (!audio) {
      console.warn('[SoundEngine] No audio available for', tool);
      return;
    }

    // Calculate volume based on mode
    let targetVolume = volume ?? this.preferences.defaultVolume;
    if (mode === 'night') {
      targetVolume = this.preferences.nightModeVolume;
    }

    // Setup audio
    audio.loop = true;
    audioHelpers.enableSeamlessLoop(audio);

    // Play with fade in
    this.currentAudio = audio;
    this.currentTool = tool;

    try {
      await audio.play();
      audioHelpers.fadeIn({
        audio,
        duration: 2,
        targetVolume,
      });

      // Trigger haptics
      if (hapticsEnabled) {
        haptics.sessionStart();
      }

      // Setup duration-based auto-stop
      if (duration) {
        setTimeout(() => {
          this.stop();
          if (hapticsEnabled) {
            haptics.sessionEnd();
          }
        }, duration * 60 * 1000);
      }
    } catch (error) {
      console.error('[SoundEngine] Playback failed:', error);
    }
  }

  /**
   * Stop current playback
   */
  stop(): void {
    if (!this.currentAudio) return;

    audioHelpers.fadeOut({
      audio: this.currentAudio,
      duration: 2,
      targetVolume: 0,
      onComplete: () => {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        }
      },
    });

    this.currentAudio = null;
    this.currentTool = null;
  }

  /**
   * Fade in current audio
   */
  fadeIn(duration: number = 2, targetVolume?: number): void {
    if (!this.currentAudio) return;

    audioHelpers.fadeIn({
      audio: this.currentAudio,
      duration,
      targetVolume: targetVolume ?? this.preferences.defaultVolume,
    });
  }

  /**
   * Fade out current audio
   */
  fadeOut(duration: number = 2): void {
    if (!this.currentAudio) return;

    audioHelpers.fadeOut({
      audio: this.currentAudio,
      duration,
      targetVolume: 0,
    });
  }

  /**
   * Set volume
   */
  setVolume(volume: number): void {
    if (!this.currentAudio) return;

    this.currentAudio.volume = Math.max(0, Math.min(1, volume));
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
    return Array.from(this.soundUrls.keys());
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
      await this.play(step.tool, {
        ...options,
        duration: step.duration,
      });

      // Wait for step duration
      await new Promise((resolve) => setTimeout(resolve, step.duration * 60 * 1000));

      // Crossfade to next step if not last
      if (!isLast) {
        const nextStep = steps[i + 1];
        const nextSound = this.preferences.toolSounds[nextStep.tool];
        const nextAudio = await this.getOrCreateAudio(nextSound);

        if (nextAudio && this.currentAudio) {
          await audioHelpers.crossfade(
            this.currentAudio,
            nextAudio,
            3,
            options.volume ?? this.preferences.defaultVolume
          );
          this.currentAudio = nextAudio;
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
   * Get or create audio element for a sound
   */
  private async getOrCreateAudio(soundName: SoundName): Promise<HTMLAudioElement | null> {
    // Check cache
    let audio = this.audioCache.get(soundName);
    if (audio) return audio;

    // Check if URL exists
    let url = this.soundUrls.get(soundName);

    // Download if needed
    if (!url) {
      const config = this.SOUND_SOURCES.find((s) => s.filename === `${soundName}.mp3`);
      if (config) {
        url = await downloader.download(config);
        this.soundUrls.set(soundName, url);
      }
    }

    if (!url) return null;

    // Create audio element
    audio = new Audio(url);
    audio.preload = 'auto';
    this.audioCache.set(soundName, audio);

    return audio;
  }

  /**
   * Cleanup and reset
   */
  cleanup(): void {
    this.stop();
    audioHelpers.cleanup();
    this.audioCache.clear();
    this.soundUrls.clear();
    this.initialized = false;
  }
}

export const SoundEngine = new SoundEngineClass();
