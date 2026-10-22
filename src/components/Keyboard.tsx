import { memo } from 'react'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

type Props = {
  word: string
  guessed: string[]
  disabled: boolean
  onGuess: (letter: string) => void
}

const KEY_STYLES = {
  idle: 'bg-white text-ink shadow-slate-300 hover:bg-amber-50 dark:bg-slate-700 dark:text-slate-100 dark:shadow-slate-950 dark:hover:bg-slate-600',
  correct: 'bg-emerald-500 text-white shadow-emerald-700',
  wrong: 'bg-rose-200 text-rose-700 opacity-60 shadow-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:shadow-rose-900',
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
                className={`h-12 min-w-0 flex-1 basis-0 rounded-lg font-display text-lg font-semibold uppercase shadow-[0_3px_0] transition-[transform,background-color] duration-150 enabled:active:translate-y-0.5 enabled:active:shadow-[0_1px_0] disabled:cursor-not-allowed sm:h-14 sm:max-w-12 sm:text-xl ${KEY_STYLES[state]} ${disabled && !used ? 'opacity-50' : ''}`}
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
