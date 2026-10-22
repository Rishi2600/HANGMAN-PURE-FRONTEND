import { useEffect, useState } from 'react'
import { readStorage, writeStorage, type StorageKey } from '../lib/storage'

/**
 * useState that survives page reloads.
 * `fallback` may be a function so expensive defaults are only computed on first render.
 */
export function useLocalStorage<T>(
  key: StorageKey,
  fallback: T | (() => T),
  isValid?: (value: unknown) => boolean,
) {
  const [value, setValue] = useState<T>(() =>
    readStorage(key, fallback instanceof Function ? fallback() : fallback, isValid),
  )

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
