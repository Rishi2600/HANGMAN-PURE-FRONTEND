import type { ReactNode } from 'react'
import { useSettings } from '../settings/settingsContext'

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-full text-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  )
}

type Props = {
  /** When provided, a back arrow to the menu is shown. */
  onBack?: () => void
  onOpenStats: () => void
}

export function Header({ onBack, onOpenStats }: Props) {
  const { theme, soundOn, toggleTheme, toggleSound } = useSettings()

  return (
    <header className="flex items-center justify-between gap-2 py-3 sm:py-4">
      <div className="flex items-center gap-1">
        {onBack && (
          <IconButton label="Back to menu" onClick={onBack}>
            ←
          </IconButton>
        )}
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Hang<span className="text-amber-500">man</span>
        </h1>
      </div>
      <nav className="flex items-center" aria-label="Settings">
        <IconButton label="Statistics" onClick={onOpenStats}>
          📊
        </IconButton>
        <IconButton label={soundOn ? 'Mute sounds' : 'Unmute sounds'} onClick={toggleSound}>
          {soundOn ? '🔊' : '🔇'}
        </IconButton>
        <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </IconButton>
      </nav>
    </header>
  )
}
