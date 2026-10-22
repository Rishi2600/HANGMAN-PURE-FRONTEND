import { DIFFICULTIES, type Difficulty } from '../game/game'
import { dailyNumber, type DailyRecord } from '../game/daily'
import { CATEGORIES, type CategoryId } from '../game/words'
import type { Stats } from '../game/stats'
import { Button } from './Button'
import { ChoiceGroup } from './ChoiceGroup'
import { Countdown } from './Countdown'

export type ClassicOptions = { category: CategoryId | 'any'; difficulty: Difficulty }

type Props = {
  today: string
  dailyStatus: DailyRecord['status'] | 'new'
  options: ClassicOptions
  onOptionsChange: (options: ClassicOptions) => void
  canResume: boolean
  stats: Stats
  onPlayClassic: () => void
  onResume: () => void
  onPlayDaily: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'any' as const, label: '🎲 Any' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: `${c.emoji} ${c.label}` })),
]

const DIFFICULTY_OPTIONS = (Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => ({
  value: d,
  label: DIFFICULTIES[d].label,
  title: DIFFICULTIES[d].blurb,
}))

const DAILY_CTA = {
  new: "Play today's word",
  playing: 'Resume daily',
  won: 'Solved ✅ · View result',
  lost: 'Missed ❌ · View result',
}

const card = 'rounded-3xl bg-white p-5 shadow-[0_6px_0] shadow-slate-200 sm:p-6 dark:bg-slate-800 dark:shadow-slate-950'

export function StartScreen(props: Props) {
  const { today, dailyStatus, options, onOptionsChange, canResume, stats } = props

  return (
    <div className="flex flex-col gap-5 pb-4">
      <section className="py-2 text-center">
        <p className="font-display text-2xl font-semibold sm:text-3xl">Guess the word. Save the stick figure.</p>
        {stats.played > 0 && (
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            🔥 Streak {stats.currentStreak} · 🏆 Best score {stats.bestScore}
          </p>
        )}
      </section>

      <section className={`${card} bg-gradient-to-br from-amber-100 to-orange-100 shadow-amber-200 dark:from-amber-400/15 dark:to-orange-500/10 dark:bg-slate-800`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">📅 Daily challenge #{dailyNumber(today)}</h2>
            <p className="text-slate-600 dark:text-slate-300">
              One word for everyone, every day.{' '}
              {dailyStatus === 'won' || dailyStatus === 'lost' ? (
                <>
                  Next in <Countdown />
                </>
              ) : (
                'Medium difficulty.'
              )}
            </p>
          </div>
          <Button onClick={props.onPlayDaily} variant={dailyStatus === 'new' ? 'primary' : 'secondary'}>
            {DAILY_CTA[dailyStatus]}
          </Button>
        </div>
      </section>

      <section className={`${card} flex flex-col gap-5`}>
        <h2 className="font-display text-2xl font-bold">🎯 Classic</h2>
        <ChoiceGroup
          legend="Category"
          value={options.category}
          options={CATEGORY_OPTIONS}
          onChange={(category) => onOptionsChange({ ...options, category })}
        />
        <div>
          <ChoiceGroup
            legend="Difficulty"
            value={options.difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={(difficulty) => onOptionsChange({ ...options, difficulty })}
          />
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{DIFFICULTIES[options.difficulty].blurb}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={props.onPlayClassic} className="flex-1">
            {canResume ? 'New game' : 'Play'} ▶
          </Button>
          {canResume && (
            <Button variant="secondary" onClick={props.onResume} className="flex-1">
              Resume ↩
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
