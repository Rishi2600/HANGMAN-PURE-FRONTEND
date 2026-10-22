import confetti from 'canvas-confetti'

// Greys from near-white to near-black, so some of the confetti shows up on either theme.
const GREYS = ['#fafafa', '#c4c4c4', '#8a8a8a', '#4a4a4a', '#141414']

/** Two confetti cannons from the bottom corners. Skipped for users who prefer reduced motion. */
export function celebrate() {
  const shared = { spread: 70, startVelocity: 48, ticks: 220, zIndex: 100, disableForReducedMotion: true, colors: GREYS, shapes: ['square' as const] }
  confetti({ ...shared, particleCount: 90, angle: 60, origin: { x: 0, y: 0.75 } })
  confetti({ ...shared, particleCount: 90, angle: 120, origin: { x: 1, y: 0.75 } })
}
