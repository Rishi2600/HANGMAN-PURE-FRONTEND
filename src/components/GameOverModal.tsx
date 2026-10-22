import { useEffect, useState } from 'react'
import { score, type ActiveGame } from '../game/game'
import { shareText } from '../game/daily'
import { getCategory } from '../game/words'
import type { Stats } from '../game/stats'
import { Button } from './Button'
import { Countdown } from './Countdown'
import { Modal } from './Modal'

const CHEERS = ['You got it! 🎉', 'Nailed it! 🙌', 'Word wizard! ✨', 'Saved him! 🥳', 'Brilliant! 🌟']

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
    <Modal title={won ? CHEERS[game.id % CHEERS.length] : 'Out of lives 💀'} onClose={onClose}>
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">The word was</p>
          <p
            className={`font-display text-4xl font-bold tracking-wide uppercase ${won ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
          >
            {game.word}
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            {category.emoji} {category.label} · <span className="italic">{game.hint}</span>
          </p>
        </div>

        {won && (
          <dl className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 dark:bg-amber-400/15">
              <dt className="text-xs font-bold text-amber-800 uppercase dark:text-amber-300">Score</dt>
              <dd className="font-display text-3xl font-bold">+{score(game)}</dd>
            </div>
            <div className="rounded-2xl bg-orange-100 p-3 dark:bg-orange-400/15">
              <dt className="text-xs font-bold text-orange-800 uppercase dark:text-orange-300">Streak</dt>
              <dd className="font-display text-3xl font-bold">🔥 {stats.currentStreak}</dd>
            </div>
          </dl>
        )}

        {game.mode === 'daily' && (
          <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-slate-100 p-4 dark:bg-slate-900/60">
            <Button variant="success" onClick={share} className="w-full">
              {copied ? 'Copied! ✅' : 'Share result 📤'}
            </Button>
            <p className="text-sm text-slate-600 dark:text-slate-300">
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
