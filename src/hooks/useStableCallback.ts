import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * Returns a function whose identity never changes but which always runs the latest `fn`.
 * Lets memoised children receive callbacks that read fresh state without re-rendering.
 */
export function useStableCallback<Args extends unknown[], Result>(fn: (...args: Args) => Result) {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: Args) => ref.current(...args), [])
}
