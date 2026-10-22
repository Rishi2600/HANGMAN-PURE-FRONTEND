import { motion } from 'motion/react'

type Props = {
  word: string
  guessed: string[]
  /** Show the letters the player missed (used after a loss). */
  reveal: boolean
}

export function HangmanWord({ word, guessed, reveal }: Props) {
  const pattern = [...word].map((l) => (guessed.includes(l) ? l : '_')).join(' ')

  return (
    <div>
      <p className="sr-only">
        Word with {word.length} letters: {pattern}
      </p>
      <div aria-hidden="true" className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5">
        {[...word].map((letter, i) => {
          const found = guessed.includes(letter)
          const visible = found || reveal
          return (
            // Index keys are fine here: the list never reorders and letters can repeat.
            <span
              key={i}
              className="flex h-12 w-8 items-end justify-center border-b-4 border-current pb-1 font-display text-3xl font-semibold uppercase sm:h-16 sm:w-11 sm:text-5xl"
            >
              {visible && (
                <motion.span
                  initial={{ y: 14, opacity: 0, scale: 0.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                  className={found ? '' : 'text-rose-600 dark:text-rose-400'}
                >
                  {letter}
                </motion.span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
