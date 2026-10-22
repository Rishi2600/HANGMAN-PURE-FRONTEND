import { useEffect, useRef } from 'react'

type Handlers = {
  onLetter: (letter: string) => void
  onEnter?: () => void
}

/** Listens for real keyboard presses on the whole window while `enabled` is true. */
export function usePhysicalKeyboard(handlers: Handlers, enabled = true) {
  // "Latest ref" pattern: the listener always calls the newest handlers
  // without having to unsubscribe and resubscribe on every render.
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  })

  useEffect(() => {
    if (!enabled) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      if (/^[a-z]$/i.test(event.key)) {
        event.preventDefault()
        handlersRef.current.onLetter(event.key.toLowerCase())
      } else if (event.key === 'Enter' && !target?.closest('button, a')) {
        // A focused button already handles Enter itself — don't fire twice.
        handlersRef.current.onEnter?.()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
