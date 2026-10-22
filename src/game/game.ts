import type { CategoryId, WordEntry } from './words'

export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'classic' | 'daily'

/** The drawing has 10 strokes, so no difficulty can grant more lives than that. */
export const MAX_LIVES = 10

export const DIFFICULTIES: Record<
  Difficulty,
  { label: string; blurb: string; lives: number; hintCost: number | null; multiplier: number }
> = {
  easy: { label: 'Easy', blurb: '10 lives · free hint', lives: 10, hintCost: 0, multiplier: 1 },
  medium: { label: 'Medium', blurb: '8 lives · hint costs a life', lives: 8, hintCost: 1, multiplier: 1.5 },
  hard: { label: 'Hard', blurb: '6 lives · no hints', lives: 6, hintCost: null, multiplier: 2 },
}

export type ActiveGame = {
  status: 'playing' | 'won' | 'lost'
  id: number
  mode: GameMode
  /** YYYY-MM-DD for daily games, null for classic ones. */
  dailyKey: string | null
  difficulty: Difficulty
  word: string
  hint: string
  category: CategoryId
  /** Every letter guessed, in the order it was guessed. */
  guessed: string[]
  hintUsed: boolean
}

// A discriminated union: TypeScript narrows to ActiveGame once status !== 'idle'.
export type GameState = { status: 'idle' } | ActiveGame

export type GameAction =
  | {
      type: 'start'
      id: number
      entry: WordEntry
      mode: GameMode
      difficulty: Difficulty
      dailyKey?: string
    }
  | { type: 'guess'; letter: string }
  | { type: 'hint' }
  | { type: 'quit' }

export const IDLE: GameState = { status: 'idle' }

// ---- selectors: everything derivable from state is computed, never stored ----

export const isCorrect = (game: ActiveGame, letter: string) => game.word.includes(letter)

export const wrongLetters = (game: ActiveGame) => game.guessed.filter((l) => !isCorrect(game, l))

export function livesLeft(game: ActiveGame): number {
  const { lives, hintCost } = DIFFICULTIES[game.difficulty]
  const hintPenalty = game.hintUsed ? (hintCost ?? 0) : 0
  return lives - wrongLetters(game).length - hintPenalty
}

export const isSolved = (game: ActiveGame) =>
  [...game.word].every((letter) => game.guessed.includes(letter))

export function canUseHint(game: ActiveGame): boolean {
  const cost = DIFFICULTIES[game.difficulty].hintCost
  return game.status === 'playing' && !game.hintUsed && cost !== null && livesLeft(game) > cost
}

export function score(game: ActiveGame): number {
  if (game.status !== 'won') return 0
  const uniqueLetters = new Set(game.word).size
  const base = uniqueLetters * 10 + livesLeft(game) * 20 - (game.hintUsed ? 25 : 0)
  return Math.round(Math.max(base, 10) * DIFFICULTIES[game.difficulty].multiplier)
}

/** Moves a playing game into its terminal state once it is won or lost. */
function settle(game: ActiveGame): ActiveGame {
  if (isSolved(game)) return { ...game, status: 'won' }
  if (livesLeft(game) <= 0) return { ...game, status: 'lost' }
  return game
}

/**
 * Pure state machine: idle → playing → won | lost.
 * Returning the same `state` object for ignored actions lets React bail out of re-rendering.
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start': {
      const { id, entry, mode, difficulty, dailyKey } = action
      return {
        status: 'playing',
        id,
        mode,
        dailyKey: dailyKey ?? null,
        difficulty,
        word: entry.word,
        hint: entry.hint,
        category: entry.category,
        guessed: [],
        hintUsed: false,
      }
    }
    case 'guess': {
      if (state.status !== 'playing') return state
      const letter = action.letter.toLowerCase()
      if (!/^[a-z]$/.test(letter) || state.guessed.includes(letter)) return state
      return settle({ ...state, guessed: [...state.guessed, letter] })
    }
    case 'hint': {
      if (state.status === 'idle' || !canUseHint(state)) return state
      return settle({ ...state, hintUsed: true })
    }
    case 'quit':
      return IDLE
  }
}
