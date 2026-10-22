import { useEffect, useState } from 'react'
import { score, type ActiveGame } from '../game/game'
import { shareText } from '../game/daily'
import { getCategory } from '../game/words'
import type { Stats } from '../game/stats'
import { Button } from './Button'
import { Countdown } from './Countdown'
import { Modal } from './Modal'

const CHEERS = ['You got it.', 'Nailed it.', 'Word wizard.', 'Saved him.', 'Brilliant.']

type Props = {
  game: ActiveGame
  stats: Stats
  onPlayAgain: () => void
  onMenu: () => void
  onClose: () => void
}

export function GameOverModal({ game, stats, onPlayAgain, onMenu, onClose }: Props) {
  const won = game.status === 'won'
  const category = getCategory(game.category)
  const [copied, setCopied] = useState(false)

  // Hide the "Copied!" label after 2s; the cleanup cancels the timer if the modal closes first.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function share() {
    const text = shareText(game)
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }
    } catch {
      // The user dismissed the share sheet; nothing to do.
    }
  }

  return (
    // Picking by id (not Math.random) keeps rendering pure and the title stable across re-renders.
    <Modal title={won ? CHEERS[game.id % CHEERS.length] : 'Out of lives.'} onClose={onClose}>
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-muted uppercase">The word was</p>
          <p
            className={`my-1 font-mono text-4xl font-bold tracking-[0.15em] uppercase ${won ? '' : 'text-muted line-through decoration-2'}`}
          >
            {game.word}
          </p>
          <p className="text-muted">
            {category.label} · <span className="italic">{game.hint}</span>
          </p>
        </div>

        {won && (
          <dl className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-md bg-ink p-3 text-paper">
              <dt className="font-mono text-xs font-bold tracking-widest uppercase opacity-60">Score</dt>
              <dd className="font-mono text-3xl font-bold">+{score(game)}</dd>
            </div>
            <div className="rounded-md border-2 border-ink p-3">
              <dt className="font-mono text-xs font-bold tracking-widest text-muted uppercase">Streak</dt>
              <dd className="font-mono text-3xl font-bold">{stats.currentStreak}</dd>
            </div>
          </dl>
        )}

        {game.mode === 'daily' && (
          <div className="flex w-full flex-col items-center gap-3 rounded-md border-2 border-dashed border-line p-4">
            <Button variant="secondary" onClick={share} className="w-full">
              {copied ? 'Copied to clipboard' : 'Share result'}
            </Button>
            <p className="text-sm text-muted">
              Next daily word in <Countdown />
            </p>
          </div>
        )}

        <div className="flex w-full gap-3">
          <Button variant="secondary" onClick={onMenu} className="flex-1">
            Menu
          </Button>
          <Button onClick={onPlayAgain} className="flex-1" data-autofocus>
            {game.mode === 'daily' ? 'Play classic' : 'Play again'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
