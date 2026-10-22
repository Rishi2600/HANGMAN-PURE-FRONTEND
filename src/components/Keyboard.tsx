import { memo } from 'react'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

type Props = {
  word: string
  guessed: string[]
  disabled: boolean
  onGuess: (letter: string) => void
}

// No colour to lean on, so state is shown by fill: hits are solid ink, misses fade out and get struck through.
const KEY_STYLES = {
  idle: 'border-ink bg-surface text-ink shadow-hard-sm hover:bg-wash',
  correct: 'border-ink bg-ink text-paper',
  wrong: 'border-line bg-transparent text-muted line-through decoration-2',
}

// memo: the keyboard only re-renders when its props change, not on every parent render.
// That relies on `onGuess` being a stable function (see useStableCallback in App).
function KeyboardImpl({ word, guessed, disabled, onGuess }: Props) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-1.5 sm:gap-2" role="group" aria-label="Letter keyboard">
      {ROWS.map((row) => (
        <div key={row} className="flex justify-center gap-1 sm:gap-1.5">
          {[...row].map((letter) => {
            const used = guessed.includes(letter)
            const state = !used ? 'idle' : word.includes(letter) ? 'correct' : 'wrong'
            return (
              <button
                key={letter}
                type="button"
                onClick={() => onGuess(letter)}
                disabled={used || disabled}
                aria-label={`${letter.toUpperCase()}${used ? (state === 'correct' ? ', in the word' : ', not in the word') : ''}`}
                className={`h-12 min-w-0 flex-1 basis-0 rounded-md border-2 font-mono text-lg font-bold uppercase transition-[transform,box-shadow,background-color] duration-100 enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-none disabled:cursor-not-allowed sm:h-14 sm:max-w-12 sm:text-xl ${KEY_STYLES[state]} ${disabled && !used ? 'opacity-40' : ''}`}
              >
                {letter}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export const Keyboard = memo(KeyboardImpl)
