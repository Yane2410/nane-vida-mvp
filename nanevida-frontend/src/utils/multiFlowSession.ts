/**
 * Multi-Flow Session Manager
 * Combines multiple wellness tools into seamless sessions with audio/haptics sync
 */

import { soundController } from './soundController';
import { haptics } from '../sound-engine/utils/haptics';

export type ToolName = 'breath' | 'calm' | 'grounding' | 'reflection';

export interface FlowStep {
  tool: ToolName;
  duration: number; // minutes
  config?: {
    breathPattern?: string;
    calmTechnique?: string;
    enableHaptics?: boolean;
  };
}

export interface MultiFlowSession {
  name: string;
  description: string;
  steps: FlowStep[];
  totalDuration: number; // calculated automatically
}

// Predefined multi-flow sessions
export const predefinedSessions: MultiFlowSession[] = [
  {
    name: 'Calma Rápida (5 min)',
    description: 'Respiración + Técnica de calma para alivio inmediato',
    steps: [
      { tool: 'breath', duration: 2, config: { breathPattern: '4-4-4' } },
      { tool: 'calm', duration: 3, config: { calmTechnique: 'Respiración 4-7-8' } }
    ],
    totalDuration: 5
  },
  {
    name: 'Reset Mental (10 min)',
    description: 'Ciclo completo: respiración, grounding y reflexión',
    steps: [
      { tool: 'breath', duration: 3, config: { breathPattern: '4-7-8' } },
      { tool: 'grounding', duration: 4 },
      { tool: 'reflection', duration: 3 }
    ],
    totalDuration: 10
  },
  {
    name: 'Paz Profunda (15 min)',
    description: 'Sesión extendida para calma completa',
    steps: [
      { tool: 'breath', duration: 5, config: { breathPattern: '4-7-8' } },
      { tool: 'calm', duration: 5, config: { calmTechnique: 'Visualización del Lugar Seguro' } },
      { tool: 'grounding', duration: 3 },
      { tool: 'reflection', duration: 2 }
    ],
    totalDuration: 15
  },
  {
    name: 'Ansiedad Nocturna (8 min)',
    description: 'Preparación para dormir con técnicas calmantes',
    steps: [
      { tool: 'breath', duration: 4, config: { breathPattern: '4-7-8' } },
      { tool: 'calm', duration: 4, config: { calmTechnique: 'Relajación Muscular Progresiva' } }
    ],
    totalDuration: 8
  }
];

export class MultiFlowManager {
  private currentSession: MultiFlowSession | null = null;
  private currentStepIndex: number = 0;
  private onPhaseChangeCallback: ((step: FlowStep, index: number) => void) | null = null;
  private onSessionEndCallback: (() => void) | null = null;
  private enableHaptics: boolean = true;

  /**
   * Start a multi-flow session
   */
  startSession(session: MultiFlowSession, enableHaptics: boolean = true): void {
    this.currentSession = session;
    this.currentStepIndex = 0;
    this.enableHaptics = enableHaptics;

    // Play session start feedback
    soundController.playOnce('bell', 0.4);
    if (this.enableHaptics) {
      haptics.sessionStart();
    }

    // Start first step
    this.transitionToNextStep();
  }

  /**
   * Transition to next step in session
   */
  transitionToNextStep(): void {
    if (!this.currentSession) return;

    const currentStep = this.currentSession.steps[this.currentStepIndex];
    
    if (!currentStep) {
      this.endSession();
      return;
    }

    // Audio transition
    this.playStepAudio(currentStep.tool);

    // Haptic feedback on transition
    if (this.enableHaptics && this.currentStepIndex > 0) {
      haptics.techniqueTransition();
    }

    // Trigger callback
    if (this.onPhaseChangeCallback) {
      this.onPhaseChangeCallback(currentStep, this.currentStepIndex);
    }

    this.currentStepIndex++;
  }

  /**
   * Play appropriate audio for each tool
   */
  private playStepAudio(tool: ToolName): void {
    soundController.stopAll();

    switch (tool) {
      case 'breath':
        soundController.playLoop('breath', 0.15);
        break;
      case 'calm':
        soundController.playLoop('wind', 0.1);
        break;
      case 'grounding':
        soundController.playLoop('water', 0.1);
        break;
      case 'reflection':
        soundController.playLoop('water', 0.15);
        break;
    }
  }

  /**
   * End current session
   */
  endSession(): void {
    soundController.stopAll();
    soundController.playOnce('bell', 0.5);
    
    if (this.enableHaptics) {
      haptics.sessionEnd();
    }

    if (this.onSessionEndCallback) {
      this.onSessionEndCallback();
    }

    this.currentSession = null;
    this.currentStepIndex = 0;
  }

  /**
   * Register phase change callback
   */
  onPhaseChange(callback: (step: FlowStep, index: number) => void): void {
    this.onPhaseChangeCallback = callback;
  }

  /**
   * Register session end callback
   */
  onSessionEnd(callback: () => void): void {
    this.onSessionEndCallback = callback;
  }

  /**
   * Get current session info
   */
  getCurrentSession(): MultiFlowSession | null {
    return this.currentSession;
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (!this.currentSession) return 0;
    return (this.currentStepIndex / this.currentSession.steps.length) * 100;
  }

  /**
   * Pause session (stop audio but maintain state)
   */
  pauseSession(): void {
    soundController.stopAll();
    if (this.enableHaptics) {
      haptics.trigger('medium');
    }
  }

  /**
   * Resume session
   */
  resumeSession(): void {
    if (!this.currentSession || this.currentStepIndex === 0) return;
    
    const previousStep = this.currentSession.steps[this.currentStepIndex - 1];
    this.playStepAudio(previousStep.tool);
    
    if (this.enableHaptics) {
      haptics.trigger('medium');
    }
  }
}

// Export singleton instance
export const multiFlowManager = new MultiFlowManager();
