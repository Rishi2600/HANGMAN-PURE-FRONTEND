import { useEffect, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS, isObjectWith } from '../lib/storage'
import { SettingsContext, type Settings, type SettingsContextValue } from './settingsContext'

const systemDefaults = (): Settings => ({
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  soundOn: true,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.settings,
    systemDefaults,
    isObjectWith('theme', 'soundOn'),
  )

  // Syncing React state to something outside React (the <html> element) is what effects are for.
  useEffect(() => {
    const dark = settings.theme === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a0a0a' : '#fafafa')
  }, [settings.theme])

  // Memoised so consumers only re-render when settings actually change.
  const value = useMemo<SettingsContextValue>(
    () => ({
      ...settings,
      toggleTheme: () => setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSound: () => setSettings((s) => ({ ...s, soundOn: !s.soundOn })),
    }),
    [settings, setSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
