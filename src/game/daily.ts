import {
  DIFFICULTIES,
  IDLE,
  gameReducer,
  isCorrect,
  livesLeft,
  type ActiveGame,
  type Difficulty,
} from './game'
import { ALL_WORDS, type WordEntry } from './words'

export const DAILY_DIFFICULTY: Difficulty = 'medium'

/** A letter, or 'hint'. Storing moves (not state) lets us rebuild the game by replaying them. */
export type DailyMove = string

export type DailyRecord = {
  date: string
  moves: DailyMove[]
  status: ActiveGame['status']
}

const FIRST_DAY = Date.UTC(2026, 0, 1)
const DAY_MS = 24 * 60 * 60 * 1000

/** Local calendar date as YYYY-MM-DD, so the puzzle flips at the player's midnight. */
export function dateKey(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** FNV-1a: a tiny deterministic string hash, so every player gets the same word per day. */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function dailyEntry(key: string): WordEntry {
  return ALL_WORDS[hash(`hangman-daily:${key}`) % ALL_WORDS.length]
}

export function dailyNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.round((Date.UTC(y, m - 1, d) - FIRST_DAY) / DAY_MS) + 1
}

/** Rebuilds today's game from scratch by replaying the saved moves through the pure reducer. */
export function buildDailyGame(key: string, record: DailyRecord | null, id: number): ActiveGame {
  const start = gameReducer(IDLE, {
    type: 'start',
    id,
    entry: dailyEntry(key),
    mode: 'daily',
    difficulty: DAILY_DIFFICULTY,
    dailyKey: key,
  }) as ActiveGame
  const moves = record?.date === key ? record.moves : []
  return moves.reduce<ActiveGame>(
    (game, move) =>
      gameReducer(game, move === 'hint' ? { type: 'hint' } : { type: 'guess', letter: move }) as ActiveGame,
    start,
  )
}

export function shareText(game: ActiveGame): string {
  const key = game.dailyKey ?? dateKey()
  const lives = DIFFICULTIES[game.difficulty].lives
  const result = game.status === 'won' ? `Solved · ${livesLeft(game)}/${lives} lives left` : `Missed · 0/${lives}`
  // Monochrome grid to match the UI: ⬛ = hit, ⬜ = miss.
  const grid = game.guessed.map((l) => (isCorrect(game, l) ? '⬛' : '⬜')).join('')
  return `Hangman Daily #${dailyNumber(key)} · ${result}\n${grid}${game.hintUsed ? ' +hint' : ''}`
}

export function msUntilTomorrow(now = new Date()): number {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return midnight.getTime() - now.getTime()
}
