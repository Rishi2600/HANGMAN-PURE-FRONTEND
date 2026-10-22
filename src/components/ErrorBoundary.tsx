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
        <p className="font-mono text-xs font-bold tracking-widest text-muted uppercase">Error</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Something snapped.</h1>
        <p className="text-muted">
          The game hit an unexpected error. Reloading usually fixes it. If not, reset your saved data.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => location.reload()}
            className="rounded-md border-2 border-ink bg-ink px-5 py-2.5 font-bold text-paper"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => {
              clearStorage()
              location.reload()
            }}
            className="rounded-md border-2 border-ink px-5 py-2.5 font-bold"
          >
            Reset data
          </button>
        </div>
      </main>
    )
  }
}
