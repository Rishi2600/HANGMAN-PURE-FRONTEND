import { useCallback } from 'react'
import { SOUNDS, type SoundName } from '../lib/sound'
import { useSettings } from '../settings/settingsContext'

/** Returns a stable `play(name)` that respects the mute setting. */
export function useSound() {
  const { soundOn } = useSettings()
  return useCallback(
    (name: SoundName) => {
      if (soundOn) SOUNDS[name]()
    },
    [soundOn],
  )
}
