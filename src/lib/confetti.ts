import confetti from 'canvas-confetti'

/** Two confetti cannons from the bottom corners. Skipped for users who prefer reduced motion. */
export function celebrate() {
  const shared = { spread: 70, startVelocity: 48, ticks: 220, zIndex: 100, disableForReducedMotion: true }
  confetti({ ...shared, particleCount: 90, angle: 60, origin: { x: 0, y: 0.75 } })
  confetti({ ...shared, particleCount: 90, angle: 120, origin: { x: 1, y: 0.75 } })
}
