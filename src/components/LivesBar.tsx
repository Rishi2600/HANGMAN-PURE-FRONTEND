type Props = { livesLeft: number; maxLives: number }

export function LivesBar({ livesLeft, maxLives }: Props) {
  return (
    <div
      className="flex items-center gap-2"
      role="meter"
      aria-label="Lives left"
      aria-valuemin={0}
      aria-valuemax={maxLives}
      aria-valuenow={livesLeft}
    >
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: maxLives }, (_, i) => (
          <span
            key={i}
            className={`size-3 border-2 transition-colors duration-300 sm:size-3.5 ${i < livesLeft ? 'border-ink bg-ink' : 'border-line'}`}
          />
        ))}
      </div>
      <span aria-hidden="true" className="font-mono text-sm font-bold tabular-nums">
        {livesLeft}/{maxLives}
      </span>
    </div>
  )
}
