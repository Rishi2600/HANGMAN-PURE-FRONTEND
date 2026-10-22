import { memo } from 'react'
import { motion } from 'motion/react'
import { MAX_LIVES, type ActiveGame } from '../game/game'

// 10 strokes, drawn in order. The first four (gallows) are pre-drawn on harder difficulties.
const PARTS = [
  'M20 232 H180', // ground
  'M60 232 V20', // pole
  'M60 20 H140 M60 56 L96 20', // beam + brace
  'M140 20 V46', // rope
  'M140 46 a18 18 0 1 1 0 36 a18 18 0 1 1 0 -36', // head
  'M140 82 V146', // body
  'M140 100 L114 126', // left arm
  'M140 100 L166 126', // right arm
  'M140 146 L118 188', // left leg
  'M140 146 L162 188', // right leg
]
const GALLOWS = 4

type Props = { livesLeft: number; status: ActiveGame['status'] }

function HangmanDrawingImpl({ livesLeft, status }: Props) {
  const shown = Math.min(MAX_LIVES - livesLeft, PARTS.length)
  const lost = status === 'lost'

  const stroke = (i: number) => (
    <motion.path
      key={i}
      d={PARTS[i]}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    />
  )
  const indices = Array.from({ length: shown }, (_, i) => i)

  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label={`Hangman drawing: ${shown} of ${PARTS.length} parts drawn`}
      className="h-56 w-auto sm:h-72"
      fill="none"
      strokeWidth={6}
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <g className="stroke-muted">{indices.filter((i) => i < GALLOWS).map(stroke)}</g>

      <motion.g
        className={`stroke-ink ${lost ? 'animate-sway' : ''}`}
        style={{ transformOrigin: '140px 20px', transformBox: 'view-box' }}
        animate={status === 'won' ? { y: [0, -12, 0, -6, 0] } : { y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {indices.filter((i) => i >= GALLOWS).map(stroke)}
        {lost && (
          <motion.path
            d="M131 57 l6 6 m0 -6 l-6 6 M143 57 l6 6 m0 -6 l-6 6"
            strokeWidth={3}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          />
        )}
      </motion.g>
    </svg>
  )
}

export const HangmanDrawing = memo(HangmanDrawingImpl)
