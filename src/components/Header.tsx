import type { ReactNode } from 'react'
import { useSettings } from '../settings/settingsContext'
import { BackIcon, MoonIcon, SoundOffIcon, SoundOnIcon, StatsIcon, SunIcon } from './Icons'

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-10 place-items-center rounded-md border-2 border-transparent transition-colors hover:border-ink"
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
    <header className="mb-2 flex items-center justify-between gap-2 border-b-2 border-ink py-3 sm:mb-4 sm:py-4">
      <div className="flex items-center gap-1">
        {onBack && (
          <IconButton label="Back to menu" onClick={onBack}>
            <BackIcon />
          </IconButton>
        )}
        <h1 className="font-display text-2xl font-bold tracking-[-0.04em] uppercase sm:text-3xl">
          Hang<span className="text-muted">man</span>
        </h1>
      </div>
      <nav className="flex items-center" aria-label="Settings">
        <IconButton label="Statistics" onClick={onOpenStats}>
          <StatsIcon />
        </IconButton>
        <IconButton label={soundOn ? 'Mute sounds' : 'Unmute sounds'} onClick={toggleSound}>
          {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </IconButton>
        <IconButton label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </IconButton>
      </nav>
    </header>
  )
}
