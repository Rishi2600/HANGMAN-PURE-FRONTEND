import { describe, expect, it } from 'vitest'
import { buildDailyGame, dailyEntry, dailyNumber, dateKey, msUntilTomorrow, shareText } from './daily'

describe('daily challenge', () => {
  it('formats the local date as YYYY-MM-DD', () => {
    expect(dateKey(new Date(2026, 9, 5, 23, 59))).toBe('2026-10-05')
  })

  it('picks the same word for the same day', () => {
    expect(dailyEntry('2026-10-22')).toEqual(dailyEntry('2026-10-22'))
  })

  it('numbers days from the first of January 2026', () => {
    expect(dailyNumber('2026-01-01')).toBe(1)
    expect(dailyNumber('2026-10-22')).toBe(295)
  })

  it('rebuilds progress by replaying saved moves', () => {
    const key = '2026-10-22'
    const { word } = dailyEntry(key)
    const moves = ['hint', ...new Set(word)]
    const game = buildDailyGame(key, { date: key, moves, status: 'won' }, 7)
    expect(game.status).toBe('won')
    expect(game.hintUsed).toBe(true)
    expect(shareText(game)).toMatch(/^Hangman Daily #295 ✅/)
  })

  it('ignores a record from a different day', () => {
    const game = buildDailyGame('2026-10-22', { date: '2026-10-21', moves: ['e'], status: 'playing' }, 1)
    expect(game.guessed).toEqual([])
  })

  it('counts down to local midnight', () => {
    expect(msUntilTomorrow(new Date(2026, 9, 22, 23, 0, 0))).toBe(60 * 60 * 1000)
  })
})
