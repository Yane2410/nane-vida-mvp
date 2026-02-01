type ToneSession = {
  fadeTo: (targetVolume: number, durationSeconds: number) => void
  setVolume: (volume: number) => void
  stop: (fadeSeconds?: number) => void
}

let audioContext: AudioContext | null = null

export function initAudio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioCtor) return null
  if (!audioContext) {
    audioContext = new AudioCtor()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {})
  }
  return audioContext
}

function createGain(context: AudioContext): GainNode {
  const gain = context.createGain()
  gain.gain.setValueAtTime(0, context.currentTime)
  gain.connect(context.destination)
  return gain
}

function createSession(context: AudioContext, gain: GainNode, nodes: AudioScheduledSourceNode[]): ToneSession {
  const fadeTo = (targetVolume: number, durationSeconds: number) => {
    const now = context.currentTime
    const current = gain.gain.value
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(current, now)
    gain.gain.linearRampToValueAtTime(Math.max(0, targetVolume), now + Math.max(0.01, durationSeconds))
  }

  const setVolume = (volume: number) => {
    const now = context.currentTime
    gain.gain.cancelScheduledValues(now)
    gain.gain.setValueAtTime(Math.max(0, volume), now)
  }

  const stop = (fadeSeconds: number = 0.2) => {
    const now = context.currentTime
    const end = now + Math.max(0.01, fadeSeconds)
    fadeTo(0, fadeSeconds)
    nodes.forEach((node) => {
      try {
        node.stop(end + 0.02)
      } catch {
        // no-op
      }
    })
  }

  return { fadeTo, setVolume, stop }
}

export function createToneSession(options: {
  frequencies: number[]
  wave?: OscillatorType
}): ToneSession | null {
  const context = initAudio()
  if (!context) return null

  const now = context.currentTime
  const gain = createGain(context)
  const wave = options.wave ?? 'sine'

  const nodes = options.frequencies.map((freq) => {
    const oscillator = context.createOscillator()
    oscillator.type = wave
    oscillator.frequency.setValueAtTime(freq, now)
    oscillator.connect(gain)
    oscillator.start(now)
    return oscillator
  })

  return createSession(context, gain, nodes)
}

export function createNoiseSession(): ToneSession | null {
  const context = initAudio()
  if (!context) return null

  const gain = createGain(context)
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1
  }

  const source = context.createBufferSource()
  source.buffer = buffer
  source.loop = true
  source.connect(gain)
  source.start(context.currentTime)

  return createSession(context, gain, [source])
}

export function playTone(frequency: number, durationMs: number = 500, volume: number = 0.3): void {
  const context = initAudio()
  if (!context) return

  const now = context.currentTime
  const gain = createGain(context)
  const oscillator = context.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, now)
  oscillator.connect(gain)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000)

  oscillator.start(now)
  oscillator.stop(now + durationMs / 1000 + 0.05)
}

export function playBell(): void {
  playTone(880, 450, 0.25)
  playTone(1320, 380, 0.18)
}

export function playChime(): void {
  playTone(660, 380, 0.22)
}

export type { ToneSession }
