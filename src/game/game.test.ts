import { describe, expect, it } from 'vitest'
import {
  IDLE,
  canUseHint,
  gameReducer,
  livesLeft,
  score,
  wrongLetters,
  type ActiveGame,
  type Difficulty,
  type GameState,
} from './game'
import { recordResult, EMPTY_STATS } from './stats'

function start(word = 'apple', difficulty: Difficulty = 'medium'): ActiveGame {
  return gameReducer(IDLE, {
    type: 'start',
    id: 1,
    entry: { word, hint: 'a fruit', category: 'food' },
    mode: 'classic',
    difficulty,
  }) as ActiveGame
}

const guess = (state: GameState, letters: string) =>
  [...letters].reduce((s, letter) => gameReducer(s, { type: 'guess', letter }), state) as ActiveGame

describe('gameReducer', () => {
  it('starts a fresh playing game', () => {
    const game = start()
    expect(game.status).toBe('playing')
    expect(game.guessed).toEqual([])
    expect(livesLeft(game)).toBe(8)
  })

  it('normalises case and ignores repeats and non-letters', () => {
    const game = start()
    const after = guess(game, 'PpP1!')
    expect(after.guessed).toEqual(['p'])
    expect(gameReducer(after, { type: 'guess', letter: 'p' })).toBe(after)
  })

  it('counts wrong guesses against lives', () => {
    const game = guess(start(), 'xz')
    expect(wrongLetters(game)).toEqual(['x', 'z'])
    expect(livesLeft(game)).toBe(6)
  })

  it('wins once every letter is revealed', () => {
    const game = guess(start(), 'aple')
    expect(game.status).toBe('won')
    expect(score(game)).toBeGreaterThan(0)
  })

  it('loses when lives run out and then ignores further guesses', () => {
    const game = guess(start('apple', 'hard'), 'bcdfgh')
    expect(game.status).toBe('lost')
    expect(score(game)).toBe(0)
    expect(gameReducer(game, { type: 'guess', letter: 'a' })).toBe(game)
  })

  it('charges a life for a hint on medium only', () => {
    expect(livesLeft(gameReducer(start('apple', 'easy'), { type: 'hint' }) as ActiveGame)).toBe(10)
    expect(livesLeft(gameReducer(start(), { type: 'hint' }) as ActiveGame)).toBe(7)
    expect(canUseHint(start('apple', 'hard'))).toBe(false)
  })

  it('refuses a hint that would cost the last life', () => {
    const game = guess(start(), 'bcdfghj')
    expect(livesLeft(game)).toBe(1)
    expect(gameReducer(game, { type: 'hint' })).toBe(game)
  })

  it('quits back to idle', () => {
    expect(gameReducer(start(), { type: 'quit' })).toEqual({ status: 'idle' })
  })
})

describe('recordResult', () => {
  it('tracks streaks and resets them on a loss', () => {
    const won = guess(start(), 'aple')
    const lost = guess(start('apple', 'hard'), 'bcdfgh')
    const twoWins = recordResult(recordResult(EMPTY_STATS, won), won)
    expect(twoWins).toMatchObject({ played: 2, wins: 2, currentStreak: 2, bestStreak: 2 })
    expect(recordResult(twoWins, lost)).toMatchObject({ played: 3, currentStreak: 0, bestStreak: 2 })
  })
})
