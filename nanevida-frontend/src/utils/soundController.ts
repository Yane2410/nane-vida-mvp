/**
 * SoundController - Centralized audio management for wellness tools
 * Uses Web Audio API (browser native, no dependencies)
 */

type SoundName = 'wind' | 'bell' | 'water' | 'breath';

interface AudioInstance {
  audio: HTMLAudioElement;
  isLooping: boolean;
}

class SoundController {
  private sounds: Map<SoundName, AudioInstance> = new Map();
  private activeSounds: Set<SoundName> = new Set();

  // Sound file paths - files should be placed in /src/assets/sounds/
  private soundPaths: Record<SoundName, string> = {
    wind: '/sounds/wind.mp3',
    bell: '/sounds/bell.mp3',
    water: '/sounds/water.mp3',
    breath: '/sounds/breath-tone.mp3',
  };

  /**
   * Play a sound in loop
   */
  async playLoop(soundName: SoundName, volume: number = 0.3): Promise<void> {
    try {
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
    try {
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
   * Get or create an audio instance
   */
  private getOrCreateAudio(soundName: SoundName, isLoop: boolean): HTMLAudioElement {
    let instance = this.sounds.get(soundName);

    if (!instance) {
      const audio = new Audio(this.soundPaths[soundName]);
      audio.preload = 'auto';
      instance = { audio, isLooping: isLoop };
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
  }
}

// Export singleton instance
export const soundController = new SoundController();

// Export types
export type { SoundName };
