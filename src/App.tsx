import { Suspense, lazy, useEffect, useReducer, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Header } from './components/Header'
import { GameScreen } from './components/GameScreen'
import { StartScreen, type ClassicOptions } from './components/StartScreen'
import { IDLE, gameReducer, isCorrect, type GameAction, type GameState } from './game/game'
import { buildDailyGame, dateKey, type DailyRecord } from './game/daily'
import { EMPTY_STATS, recordResult, type Stats } from './game/stats'
import { wordsIn } from './game/words'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePhysicalKeyboard } from './hooks/usePhysicalKeyboard'
import { useSound } from './hooks/useSound'
import { useStableCallback } from './hooks/useStableCallback'
import { celebrate } from './lib/confetti'
import { STORAGE_KEYS, isObjectWith, readStorage, writeStorage } from './lib/storage'

// Code-split: the stats modal's JS is only downloaded the first time it's opened.
const StatsModal = lazy(() => import('./components/StatsModal'))

type Screen = 'menu' | 'game'

const loadSavedGame = (fallback: GameState) => readStorage(STORAGE_KEYS.game, fallback, isObjectWith('status'))
const isDailyRecord = (v: unknown) => v === null || isObjectWith('date', 'moves', 'status')(v)

function App() {
  // The third argument is a lazy initializer: it runs once to restore a game saved before a reload.
  const [game, dispatch] = useReducer(gameReducer, IDLE, loadSavedGame)
  const [screen, setScreen] = useState<Screen>(() => (game.status === 'playing' ? 'game' : 'menu'))
  const [statsOpen, setStatsOpen] = useState(false)
  const [stats, setStats] = useLocalStorage<Stats>(STORAGE_KEYS.stats, EMPTY_STATS, isObjectWith('played', 'wins'))
  const [daily, setDaily] = useLocalStorage<DailyRecord | null>(STORAGE_KEYS.daily, null, isDailyRecord)
  const [options, setOptions] = useLocalStorage<ClassicOptions>(
    STORAGE_KEYS.options,
    { category: 'any', difficulty: 'medium' },
    isObjectWith('category', 'difficulty'),
  )
  const play = useSound()

  useEffect(() => {
    writeStorage(STORAGE_KEYS.game, game)
  }, [game])

  const today = dateKey()
  const dailyStatus = daily?.date === today ? daily.status : 'new'

  function startClassic() {
    const previous = game.status === 'idle' ? null : game.word
    const pool = wordsIn(options.category).filter((w) => w.word !== previous)
    const entry = pool[Math.floor(Math.random() * pool.length)]
    dispatch({ type: 'start', id: Date.now(), entry, mode: 'classic', difficulty: options.difficulty })
    setScreen('game')
  }

  function startDaily() {
    dispatch({ type: 'restore', game: buildDailyGame(today, daily, Date.now()) })
    setScreen('game')
  }

  /**
   * Every in-game action goes through here. We run the pure reducer ourselves to learn the *next*
   * state, then fire side effects (sound, stats, confetti) right in the event handler —
   * no effect needed, and nothing can be double-counted.
   */
  function commit(action: Extract<GameAction, { type: 'guess' | 'hint' }>) {
    if (game.status !== 'playing') return
    const next = gameReducer(game, action)
    if (next === game || next.status === 'idle') return
    dispatch(action)

    const move = action.type === 'hint' ? 'hint' : action.letter.toLowerCase()
    play(action.type === 'hint' ? 'hint' : isCorrect(next, move) ? 'correct' : 'wrong')

    const key = next.dailyKey
    if (next.mode === 'daily' && key) {
      setDaily((prev) => ({
        date: key,
        moves: [...(prev?.date === key ? prev.moves : []), move],
        status: next.status,
      }))
    }

    if (next.status !== 'playing') {
      setStats((s) => recordResult(s, next))
      play(next.status === 'won' ? 'win' : 'lose')
      if (next.status === 'won') celebrate()
    }
  }

  // Stable identities so the memoised <Keyboard> doesn't re-render for unrelated state changes.
  const handleGuess = useStableCallback((letter: string) => commit({ type: 'guess', letter }))
  const handleHint = useStableCallback(() => commit({ type: 'hint' }))
  const playAgain = () => startClassic()

  usePhysicalKeyboard(
    {
      onLetter: handleGuess,
      onEnter: () => {
        if (game.status === 'won' || game.status === 'lost') playAgain()
      },
    },
    screen === 'game' && !statsOpen,
  )

  const showGame = screen === 'game' && game.status !== 'idle'

  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header onBack={showGame ? () => setScreen('menu') : undefined} onOpenStats={() => setStatsOpen(true)} />

      <main className="flex flex-1 flex-col">
        {/* mode="wait": the old screen animates out before the new one animates in. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={showGame ? `game-${game.id}` : 'menu'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 flex-col"
          >
            {showGame ? (
              <GameScreen
                key={game.id}
                game={game}
                stats={stats}
                onGuess={handleGuess}
                onHint={handleHint}
                onPlayAgain={playAgain}
                onMenu={() => setScreen('menu')}
              />
            ) : (
              <StartScreen
                today={today}
                dailyStatus={dailyStatus}
                options={options}
                onOptionsChange={setOptions}
                canResume={game.status === 'playing' && game.mode === 'classic'}
                stats={stats}
                onPlayClassic={startClassic}
                onResume={() => setScreen('game')}
                onPlayDaily={startDaily}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Suspense fallback={null}>
        {statsOpen && (
          <StatsModal stats={stats} onClose={() => setStatsOpen(false)} onReset={() => setStats(EMPTY_STATS)} />
        )}
      </Suspense>
    </div>
  )
}

export default App
