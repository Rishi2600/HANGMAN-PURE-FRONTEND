// Sound effects are synthesised with the Web Audio API — no audio files to download.
let context: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null
  context ??= new AudioContext()
  // Browsers start audio suspended until the first user gesture.
  if (context.state === 'suspended') void context.resume()
  return context
}

function tone(freq: number, delay: number, duration: number, type: OscillatorType = 'triangle', volume = 0.15) {
  const ac = audio()
  if (!ac) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(start)
  osc.stop(start + duration)
}

export const SOUNDS = {
  correct: () => {
    tone(660, 0, 0.12)
    tone(880, 0.08, 0.16)
  },
  wrong: () => tone(150, 0, 0.28, 'sawtooth', 0.07),
  hint: () => tone(988, 0, 0.2, 'sine', 0.1),
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.32)),
  lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, i * 0.16, 0.36, 'sine')),
}

export type SoundName = keyof typeof SOUNDS
