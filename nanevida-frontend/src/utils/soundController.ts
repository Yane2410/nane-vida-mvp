  /**
 * SoundController - Centralized audio management for wellness tools
 * Uses Web Audio API (browser native, no dependencies)
 */

type SoundName = 'wind' | 'bell' | 'water' | 'breath';

interface AudioInstance {
  audio: HTMLAudioElement;
  isLooping: boolean;
  isLoaded: boolean;
}

class SoundController {
  private sounds: Map<SoundName, AudioInstance> = new Map();
  private activeSounds: Set<SoundName> = new Set();
  private enabled: boolean = false; // Sonidos desactivados por defecto
  private preloadedSounds: Set<SoundName> = new Set();

  // Sound file paths - files should be placed in /src/assets/sounds/
  private soundPaths: Record<SoundName, string> = {
    wind: '/sounds/wind.mp3',
    bell: '/sounds/bell.mp3',
    water: '/sounds/water.mp3',
    breath: '/sounds/breath-tone.mp3',
  };

  /**
   * Enable sounds (call when user wants audio)
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Disable sounds
   */
  disable(): void {
    this.enabled = false;
    this.stopAll();
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Preload a sound for faster playback (lazy loading optimization)
   */
  async preload(soundName: SoundName): Promise<void> {
    if (this.preloadedSounds.has(soundName)) return;

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = this.soundPaths[soundName];
      
      // Wait for audio to be ready
      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => resolve(), { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });

      this.sounds.set(soundName, { 
        audio, 
        isLooping: false,
        isLoaded: true 
      });
      this.preloadedSounds.add(soundName);
    } catch (error) {
      console.debug(`Could not preload ${soundName}:`, error);
    }
  }

  /**
   * Play a sound in loop
   */
  async playLoop(soundName: SoundName, volume: number = 0.3): Promise<void> {
    if (!this.enabled) return; // Skip si sonidos desactivados
    
    try {
      // Preload if not loaded
      if (!this.preloadedSounds.has(soundName)) {
        await this.preload(soundName);
      }

      // Stop any other looping sounds
      this.stopAllLoops();

      const audio = this.getOrCreateAudio(soundName, true);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = true;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.activeSounds.add(soundName);
      }
    } catch (error) {
      // Silently handle errors (autoplay restrictions, etc.)
      console.debug(`Could not play ${soundName}:`, error);
    }
  }

  /**
   * Play a sound once
   */
  async playOnce(soundName: SoundName, volume: number = 0.5): Promise<void> {
    if (!this.enabled) return; // Skip si sonidos desactivados
    
    try {
      // Preload if not loaded
      if (!this.preloadedSounds.has(soundName)) {
        await this.preload(soundName);
      }

      const audio = this.getOrCreateAudio(soundName, false);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = false;
      audio.currentTime = 0; // Reset to start

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.debug(`Could not play ${soundName}:`, error);
    }
  }

  /**
   * Stop a specific sound
   */
  stop(soundName: SoundName): void {
    const instance = this.sounds.get(soundName);
    if (instance) {
      try {
        instance.audio.pause();
        instance.audio.currentTime = 0;
        this.activeSounds.delete(soundName);
      } catch (error) {
        console.debug(`Error stopping ${soundName}:`, error);
      }
    }
  }

  /**
   * Stop all active sounds
   */
  stopAll(): void {
    this.activeSounds.forEach((soundName) => {
      this.stop(soundName);
    });
  }

  /**
   * Stop all looping sounds (keeps one-time sounds playing)
   */
  private stopAllLoops(): void {
    this.sounds.forEach((instance, soundName) => {
      if (instance.isLooping && this.activeSounds.has(soundName)) {
        this.stop(soundName);
      }
    });
  }

  /**
   * Get or create an audio instance with lazy loading
   */
  private getOrCreateAudio(soundName: SoundName, isLoop: boolean): HTMLAudioElement {
    let instance = this.sounds.get(soundName);

    if (!instance) {
      const audio = new Audio(this.soundPaths[soundName]);
      audio.preload = 'none'; // Lazy load - only load when play() is called
      instance = { 
        audio, 
        isLooping: isLoop,
        isLoaded: false 
      };
      this.sounds.set(soundName, instance);
    } else {
      instance.isLooping = isLoop;
    }

    return instance.audio;
  }

  /**
   * Clean up all audio resources (call on unmount)
   */
  cleanup(): void {
    this.stopAll();
    this.sounds.forEach((instance) => {
      try {
        instance.audio.pause();
        instance.audio.src = '';
        instance.audio.load();
      } catch (error) {
        console.debug('Error during cleanup:', error);
      }
    });
    this.sounds.clear();
    this.activeSounds.clear();
    this.preloadedSounds.clear();
  }
}

// Export singleton instance
export const soundController = new SoundController();

// Export types
export type { SoundName };
