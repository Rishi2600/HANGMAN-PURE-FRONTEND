import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export type Settings = { theme: Theme; soundOn: boolean }

export type SettingsContextValue = Settings & {
  toggleTheme: () => void
  toggleSound: () => void
}

// null default + a guarded hook means a missing provider fails loudly instead of silently.
export const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside <SettingsProvider>')
  return value
}
