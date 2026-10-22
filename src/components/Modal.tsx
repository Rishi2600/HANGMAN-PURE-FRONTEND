import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'

type Props = {
  title: string
  onClose: () => void
  children: ReactNode
}

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

/** Accessible dialog rendered into document.body via a portal. */
export function Modal({ title, onClose, children }: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Move focus into the dialog on open and give it back to the trigger on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const target = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel?.querySelector<HTMLElement>(FOCUSABLE)
    target?.focus()
    return () => previous?.focus()
  }, [])

  // Escape closes; Tab is trapped inside the panel.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') return onClose()
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <motion.div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ y: 48, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 dark:bg-slate-800"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          ×
        </button>
        <h2 id={titleId} className="mb-4 text-center font-display text-3xl font-bold">
          {title}
        </h2>
        {children}
      </motion.div>
    </div>,
    document.body,
  )
}
