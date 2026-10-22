import { Component, type ErrorInfo, type ReactNode } from 'react'
import { clearStorage } from '../lib/storage'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Error boundaries must be class components: there is no hook equivalent of
 * getDerivedStateFromError / componentDidCatch.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Hangman crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-6xl">🪢</div>
        <h1 className="font-display text-3xl font-bold">Something snapped.</h1>
        <p className="text-slate-600 dark:text-slate-300">
          The game hit an unexpected error. Reloading usually fixes it. If not, reset your saved data.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => location.reload()}
            className="rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-ink shadow-[0_3px_0] shadow-amber-600"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => {
              clearStorage()
              location.reload()
            }}
            className="rounded-xl border-2 border-current px-5 py-2.5 font-bold"
          >
            Reset data
          </button>
        </div>
      </main>
    )
  }
}
