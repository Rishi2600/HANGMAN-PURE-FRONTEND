import confetti from 'canvas-confetti'

// The pistachio palette (kernel greens, wine skin, husk tan, shell), light to dark so some shows up on either theme.
// canvas-confetti draws on its own canvas and can't read CSS variables, hence the hex values.
const PISTACHIO = ['#f1f3e9', '#b9dc98', '#93c572', '#5e8a3a', '#b9a07a', '#8e3b52']

/** Two confetti cannons from the bottom corners. Skipped for users who prefer reduced motion. */
export function celebrate() {
  const shared = { spread: 70, startVelocity: 48, ticks: 220, zIndex: 100, disableForReducedMotion: true, colors: PISTACHIO, shapes: ['square' as const] }
  confetti({ ...shared, particleCount: 90, angle: 60, origin: { x: 0, y: 0.75 } })
  confetti({ ...shared, particleCount: 90, angle: 120, origin: { x: 1, y: 0.75 } })
}
