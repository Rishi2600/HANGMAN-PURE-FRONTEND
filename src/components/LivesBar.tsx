type Props = { livesLeft: number; maxLives: number }

export function LivesBar({ livesLeft, maxLives }: Props) {
  return (
    <div
      className="flex items-center gap-0.5 text-lg sm:text-xl"
      role="meter"
      aria-label="Lives left"
      aria-valuemin={0}
      aria-valuemax={maxLives}
      aria-valuenow={livesLeft}
    >
      {Array.from({ length: maxLives }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`transition-all duration-300 ${i < livesLeft ? '' : 'scale-75 opacity-25 grayscale'}`}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}
