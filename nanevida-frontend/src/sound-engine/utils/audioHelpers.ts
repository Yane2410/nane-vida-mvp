/**
 * Audio Helpers - Fade effects, volume control, loop management
 */

export interface FadeConfig {
  audio: HTMLAudioElement;
  duration: number;
  targetVolume: number;
  onComplete?: () => void;
}

export class AudioHelpers {
  private fadeIntervals = new Map<HTMLAudioElement, number>();

  /**
   * Fade in an audio element
   */
  fadeIn(config: FadeConfig): void {
    const { audio, duration, targetVolume, onComplete } = config;

    // Clear any existing fade on this audio
    this.stopFade(audio);

    audio.volume = 0;
    const startTime = Date.now();
    const interval = 50; // Update every 50ms

    const fadeInterval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      audio.volume = progress * targetVolume;

      if (progress >= 1) {
        this.stopFade(audio);
        onComplete?.();
      }
    }, interval);

    this.fadeIntervals.set(audio, fadeInterval);
  }

  /**
   * Fade out an audio element
   */
  fadeOut(config: FadeConfig): void {
    const { audio, duration, onComplete } = config;

    // Clear any existing fade on this audio
    this.stopFade(audio);

    const startVolume = audio.volume;
    const startTime = Date.now();
    const interval = 50;

    const fadeInterval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      audio.volume = startVolume * (1 - progress);

      if (progress >= 1) {
        audio.pause();
        audio.currentTime = 0;
        this.stopFade(audio);
        onComplete?.();
      }
    }, interval);

    this.fadeIntervals.set(audio, fadeInterval);
  }

  /**
   * Stop any active fade on an audio element
   */
  stopFade(audio: HTMLAudioElement): void {
    const interval = this.fadeIntervals.get(audio);
    if (interval) {
      clearInterval(interval);
      this.fadeIntervals.delete(audio);
    }
  }

  /**
   * Create a seamless loop by removing silence at start/end
   */
  enableSeamlessLoop(audio: HTMLAudioElement): void {
    audio.loop = true;

    // Add event listener to ensure smooth transition
    audio.addEventListener('timeupdate', () => {
      // If near end, prepare for loop (helps avoid click)
      if (audio.duration - audio.currentTime < 0.05) {
        audio.currentTime = 0;
      }
    });
  }

  /**
   * Ducking - Lower volume when voice guidance plays
   */
  duck(audio: HTMLAudioElement, targetVolume: number = 0.2, duration: number = 0.5): void {
    this.fadeOut({
      audio,
      duration,
      targetVolume,
    });
  }

  /**
   * Unduck - Restore volume after voice guidance
   */
  unduck(audio: HTMLAudioElement, targetVolume: number = 0.5, duration: number = 0.5): void {
    this.fadeIn({
      audio,
      duration,
      targetVolume,
    });
  }

  /**
   * Progressive volume based on session duration
   */
  setProgressiveVolume(
    audio: HTMLAudioElement,
    elapsed: number,
    total: number,
    baseVolume: number = 0.5
  ): void {
    // Start at 70% volume, peak at 100% in middle, end at 70%
    const progress = elapsed / total;
    let multiplier = 1;

    if (progress < 0.2) {
      // Fade in phase (0-20%)
      multiplier = 0.7 + (progress / 0.2) * 0.3;
    } else if (progress > 0.8) {
      // Fade out phase (80-100%)
      multiplier = 0.7 + ((1 - progress) / 0.2) * 0.3;
    }

    audio.volume = baseVolume * multiplier;
  }

  /**
   * Crossfade between two audio elements
   */
  crossfade(
    fromAudio: HTMLAudioElement,
    toAudio: HTMLAudioElement,
    duration: number,
    targetVolume: number = 0.5
  ): Promise<void> {
    return new Promise((resolve) => {
      // Start new audio at 0 volume
      toAudio.volume = 0;
      toAudio.play().catch(console.error);

      // Fade out old, fade in new
      this.fadeOut({
        audio: fromAudio,
        duration,
        targetVolume: 0,
      });

      this.fadeIn({
        audio: toAudio,
        duration,
        targetVolume,
        onComplete: resolve,
      });
    });
  }

  /**
   * Cleanup all fades
   */
  cleanup(): void {
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();
  }
}

export const audioHelpers = new AudioHelpers();
