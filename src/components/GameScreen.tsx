import { useEffect, useState } from 'react'
import { motion, useAnimate } from 'motion/react'
import { DIFFICULTIES, canUseHint, isCorrect, livesLeft, wrongLetters, type ActiveGame } from '../game/game'
import { dailyNumber } from '../game/daily'
import { getCategory } from '../game/words'
import type { Stats } from '../game/stats'
import { Button } from './Button'
import { GameOverModal } from './GameOverModal'
import { HangmanDrawing } from './HangmanDrawing'
import { HangmanWord } from './HangmanWord'
import { ArrowIcon } from './Icons'
import { Keyboard } from './Keyboard'
import { LivesBar } from './LivesBar'

type Props = {
  game: ActiveGame
  stats: Stats
  onGuess: (letter: string) => void
  onHint: () => void
  onPlayAgain: () => void
  onMenu: () => void
}

function announcement(game: ActiveGame): string {
  if (game.status === 'won') return `You won! The word was ${game.word}.`
  if (game.status === 'lost') return `Out of lives. The word was ${game.word}.`
  const last = game.guessed.at(-1)
  if (!last) return ''
  return isCorrect(game, last)
    ? `${last.toUpperCase()} is in the word.`
    : `${last.toUpperCase()} is not in the word. ${livesLeft(game)} lives left.`
}

// App renders this with key={game.id}, so `showResult` resets automatically for every new game.
export function GameScreen({ game, stats, onGuess, onHint, onPlayAgain, onMenu }: Props) {
  const [showResult, setShowResult] = useState(true)
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const misses = wrongLetters(game).length
  const lives = livesLeft(game)
  const finished = game.status !== 'playing'
  const { hintCost } = DIFFICULTIES[game.difficulty]
  const category = getCategory(game.category)

  // Shake the board on every new miss — imperatively driving an animation is a side effect.
  useEffect(() => {
    if (misses > 0) void animate(scope.current, { x: [0, -9, 9, -6, 6, 0] }, { duration: 0.4 })
  }, [misses, animate, scope])

  return (
    <div className="flex flex-1 flex-col items-center gap-4 sm:gap-6">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <span className="rounded-md border-2 border-ink px-2.5 py-1 font-mono text-xs font-bold tracking-widest uppercase">
          {game.mode === 'daily' ? `Daily #${dailyNumber(game.dailyKey ?? '')}` : DIFFICULTIES[game.difficulty].label}
          {' · '}
          {category.label}
        </span>
        <LivesBar livesLeft={lives} maxLives={DIFFICULTIES[game.difficulty].lives} />
      </div>

      <div ref={scope} className="flex flex-col items-center gap-4 sm:gap-6">
        <HangmanDrawing livesLeft={lives} status={game.status} />
        <HangmanWord word={game.word} guessed={game.guessed} reveal={game.status === 'lost'} />
      </div>

      <div className="flex min-h-12 items-center justify-center text-center">
        {game.hintUsed ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md border-2 border-dashed border-ink px-4 py-2 font-medium"
          >
            <span className="mr-2 font-mono text-xs font-bold tracking-widest text-muted uppercase">Hint</span>
            {game.hint}
          </motion.p>
        ) : finished ? null : hintCost === null ? (
          <p className="text-sm text-muted">No hints on Hard — you've got this.</p>
        ) : (
          <Button variant="secondary" className="py-2 text-base" onClick={onHint} disabled={!canUseHint(game)}>
            Hint {hintCost > 0 ? `(costs ${hintCost} ${hintCost === 1 ? 'life' : 'lives'})` : '(free)'}
          </Button>
        )}
      </div>

      {finished && !showResult && (
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowResult(true)}>
            View result
          </Button>
          <Button onClick={onPlayAgain}>{game.mode === 'daily' ? 'Play classic' : 'Play again'} <ArrowIcon /></Button>
        </div>
      )}

      <Keyboard word={game.word} guessed={game.guessed} disabled={finished} onGuess={onGuess} />

      <p className="hidden font-mono text-xs text-muted sm:block">
        Tip: type letters on your keyboard{finished ? ' · press Enter for a new game' : ''}.
      </p>

      <p className="sr-only" aria-live="polite">
        {announcement(game)}
      </p>

      {finished && showResult && (
        <GameOverModal
          game={game}
          stats={stats}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  )
}
