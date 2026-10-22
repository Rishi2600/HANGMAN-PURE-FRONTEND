import { useEffect, useState } from 'react'
import { msUntilTomorrow } from '../game/daily'

const pad = (n: number) => String(n).padStart(2, '0')

function format(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`
}

/** Live "time until the next daily word" clock. */
export function Countdown() {
  const [remaining, setRemaining] = useState(msUntilTomorrow)

  useEffect(() => {
    const timer = setInterval(() => setRemaining(msUntilTomorrow()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <time className="font-display tabular-nums" aria-live="off">
      {format(remaining)}
    </time>
  )
}
