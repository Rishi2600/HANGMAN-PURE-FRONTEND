import { DIFFICULTIES, type Difficulty } from '../game/game'
import { dailyNumber, type DailyRecord } from '../game/daily'
import { CATEGORIES, type CategoryId } from '../game/words'
import type { Stats } from '../game/stats'
import { Button } from './Button'
import { ChoiceGroup } from './ChoiceGroup'
import { Countdown } from './Countdown'
import { ArrowIcon } from './Icons'

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
  { value: 'any' as const, label: 'Any' },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
]

const DIFFICULTY_OPTIONS = (Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => ({
  value: d,
  label: DIFFICULTIES[d].label,
  title: DIFFICULTIES[d].blurb,
}))

const DAILY_CTA = {
  new: "Play today's word",
  playing: 'Resume daily',
  won: 'Solved · View result',
  lost: 'Missed · View result',
}

const card = 'rounded-md border-2 border-ink p-5 sm:p-6'
const eyebrow = 'font-mono text-xs font-bold tracking-widest uppercase'

export function StartScreen(props: Props) {
  const { today, dailyStatus, options, onOptionsChange, canResume, stats } = props

  return (
    <div className="flex flex-col gap-5 pb-4">
      <section className="py-2">
        <p className="font-display text-4xl leading-[1.05] font-bold tracking-[-0.04em] sm:text-6xl">
          Guess the word.
          <br />
          <span className="text-muted">Save the stick figure.</span>
        </p>
        {stats.played > 0 && (
          <p className={`${eyebrow} mt-4 text-muted`}>
            Streak {stats.currentStreak} · Best score {stats.bestScore}
          </p>
        )}
      </section>

      <section className={`${card} bg-ink text-paper`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={`${eyebrow} opacity-60`}>No. {dailyNumber(today)}</p>
            <h2 className="font-display text-2xl font-bold tracking-tight">Daily challenge</h2>
            <p className="opacity-70">
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
          <Button onClick={props.onPlayDaily} variant="inverse">
            {DAILY_CTA[dailyStatus]}
          </Button>
        </div>
      </section>

      <section className={`${card} flex flex-col gap-5 bg-surface shadow-hard`}>
        <h2 className="font-display text-2xl font-bold tracking-tight">Classic</h2>
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
          <p className="mt-2 text-sm text-muted">{DIFFICULTIES[options.difficulty].blurb}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={props.onPlayClassic} className="flex-1">
            {canResume ? 'New game' : 'Play'} <ArrowIcon />
          </Button>
          {canResume && (
            <Button variant="secondary" onClick={props.onResume} className="flex-1">
              Resume
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
