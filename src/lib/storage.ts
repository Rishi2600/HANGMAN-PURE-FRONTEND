// Versioned keys: bump the version if a stored shape changes so old data is ignored, not crashed on.
const PREFIX = 'hangman:v1:'

export const STORAGE_KEYS = {
  game: 'game',
  stats: 'stats',
  daily: 'daily',
  settings: 'settings',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// localStorage can throw (private mode, quota, disabled cookies), so every access is guarded.
export function readStorage<T>(key: StorageKey, fallback: T, isValid?: (value: unknown) => boolean): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid && !isValid(parsed) ? fallback : (parsed as T)
  } catch {
    return fallback
  }
}

export function writeStorage(key: StorageKey, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the game still works, it just won't persist.
  }
}

export function clearStorage(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // Nothing we can do.
  }
}

export const isObjectWith = (...fields: string[]) => (value: unknown) =>
  typeof value === 'object' && value !== null && fields.every((f) => f in value)
