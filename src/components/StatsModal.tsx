import { winRate, type Stats } from '../game/stats'
import { Button } from './Button'
import { Modal } from './Modal'

type Props = { stats: Stats; onClose: () => void; onReset: () => void }

// Default export so it can be code-split with React.lazy (see App.tsx).
export default function StatsModal({ stats, onClose, onReset }: Props) {
  const tiles = [
    { label: 'Played', value: stats.played },
    { label: 'Win %', value: winRate(stats) },
    { label: 'Streak', value: `🔥 ${stats.currentStreak}` },
    { label: 'Best streak', value: stats.bestStreak },
    { label: 'Best score', value: stats.bestScore },
    { label: 'Total score', value: stats.totalScore },
  ]

  return (
    <Modal title="Your stats 📊" onClose={onClose}>
      <dl className="grid grid-cols-3 gap-2.5">
        {tiles.map(({ label, value }) => (
          // <dt> must come before <dd>; flex-col-reverse shows the value on top.
          <div key={label} className="flex flex-col-reverse rounded-2xl bg-slate-100 p-3 text-center dark:bg-slate-900/60">
            <dt className="text-[0.7rem] font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">{label}</dt>
            <dd className="font-display text-2xl font-bold sm:text-3xl">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex gap-3">
        <Button
          variant="secondary"
          className="flex-1 text-base"
          disabled={stats.played === 0}
          onClick={() => {
            if (window.confirm('Reset all your stats? This cannot be undone.')) onReset()
          }}
        >
          Reset stats
        </Button>
        <Button className="flex-1" onClick={onClose} data-autofocus>
          Done
        </Button>
      </div>
    </Modal>
  )
}
