import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { SettingsProvider } from './settings/SettingsProvider'
import { ALL_WORDS } from './game/words'

function renderApp() {
  return render(
    <SettingsProvider>
      <App />
    </SettingsProvider>,
  )
}

const lives = () => screen.getByRole('meter', { name: 'Lives left' }).getAttribute('aria-valuenow')

describe('<App />', () => {
  it('plays a classic game to a win with the on-screen keyboard', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    const { word } = ALL_WORDS[0]
    renderApp()

    await user.click(screen.getByRole('button', { name: /^play ▶/i }))
    // AnimatePresence mode="wait" mounts the game screen after the menu's exit animation.
    const keyboard = await screen.findByRole('group', { name: 'Letter keyboard' })

    await user.click(within(keyboard).getByRole('button', { name: 'Q' }))
    expect(lives()).toBe('7')
    expect(within(keyboard).getByRole('button', { name: 'Q, not in the word' })).toBeDisabled()

    for (const letter of new Set(word)) {
      await user.click(within(keyboard).getByRole('button', { name: letter.toUpperCase() }))
    }

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('The word was')
    expect(dialog).toHaveTextContent(word)
  })

  it('charges a life for a hint on medium and shows it', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: /^play ▶/i }))

    await user.click(await screen.findByRole('button', { name: /hint/i }))
    expect(lives()).toBe('7')
    expect(screen.getByText(/💡/)).toBeInTheDocument()
  })

  it('persists stats across a remount', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const user = userEvent.setup()
    const { word } = ALL_WORDS[0]
    const { unmount } = renderApp()
    await user.click(screen.getByRole('button', { name: /^play ▶/i }))
    await screen.findByRole('group', { name: 'Letter keyboard' })
    for (const letter of new Set(word)) await user.keyboard(letter)
    await screen.findByRole('dialog')
    unmount()

    renderApp()
    await user.click(screen.getByRole('button', { name: 'Statistics' }))
    const stats = await screen.findByRole('dialog', { name: /your stats/i })
    expect(within(stats).getByText('Played').nextSibling).toHaveTextContent('1')
  })
})
