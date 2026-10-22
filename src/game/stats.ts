import { score, type ActiveGame } from './game'

export type Stats = {
  played: number
  wins: number
  currentStreak: number
  bestStreak: number
  bestScore: number
  totalScore: number
}

export const EMPTY_STATS: Stats = {
  played: 0,
  wins: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestScore: 0,
  totalScore: 0,
}

/** Returns a new Stats object — never mutates the old one (React state must be immutable). */
export function recordResult(stats: Stats, game: ActiveGame): Stats {
  const won = game.status === 'won'
  const points = score(game)
  const currentStreak = won ? stats.currentStreak + 1 : 0
  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    bestScore: Math.max(stats.bestScore, points),
    totalScore: stats.totalScore + points,
  }
}

export const winRate = (stats: Stats) =>
  stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100)
