/**
 * Haptics - Vibration patterns for mobile devices (PWA compatible)
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export class Haptics {
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'vibrate' in navigator;
  }

  /**
   * Check if haptics are supported
   */
  isAvailable(): boolean {
    return this.isSupported;
  }

  /**
   * Trigger a vibration pattern
   */
  trigger(pattern: HapticPattern): void {
    if (!this.isSupported) return;

    const patterns: Record<HapticPattern, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 50,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [50, 100, 50, 100, 50],
    };

    try {
      navigator.vibrate(patterns[pattern]);
    } catch (error) {
      console.debug('[Haptics] Vibration failed:', error);
    }
  }

  /**
   * Breathing pattern vibration (inhale/exhale rhythm)
   */
  breathPattern(phase: 'inhale' | 'hold' | 'exhale'): void {
    if (!this.isSupported) return;

    const patterns = {
      inhale: [20, 100, 20], // Short-pause-short
      hold: 10, // Single short pulse
      exhale: [30, 150, 30], // Longer pulses
    };

    try {
      navigator.vibrate(patterns[phase]);
    } catch (error) {
      console.debug('[Haptics] Breath pattern failed:', error);
    }
  }

  /**
   * Grounding step completion vibration
   */
  stepComplete(): void {
    this.trigger('success');
  }

  /**
   * Reflection prompt vibration
   */
  newPrompt(): void {
    this.trigger('light');
  }

  /**
   * Calm technique transition
   */
  techniqueTransition(): void {
    this.trigger('medium');
  }

  /**
   * Session start vibration
   */
  sessionStart(): void {
    if (!this.isSupported) return;

    try {
      navigator.vibrate([50, 100, 50, 100, 100]);
    } catch (error) {
      console.debug('[Haptics] Session start failed:', error);
    }
  }

  /**
   * Session end vibration
   */
  sessionEnd(): void {
    if (!this.isSupported) return;

    try {
      navigator.vibrate([100, 50, 100, 50, 200]);
    } catch (error) {
      console.debug('[Haptics] Session end failed:', error);
    }
  }

  /**
   * Custom vibration pattern
   */
  custom(pattern: number | number[]): void {
    if (!this.isSupported) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.debug('[Haptics] Custom pattern failed:', error);
    }
  }

  /**
   * Stop all vibrations
   */
  stop(): void {
    if (!this.isSupported) return;

    try {
      navigator.vibrate(0);
    } catch (error) {
      console.debug('[Haptics] Stop failed:', error);
    }
  }
}

export const haptics = new Haptics();
