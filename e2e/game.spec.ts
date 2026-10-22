import { expect, test } from '@playwright/test'
import { dailyEntry } from '../src/game/daily'
import { ALL_WORDS } from '../src/game/words'

const TODAY = '2026-10-22'

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date(`${TODAY}T10:00:00`))
})

test('solves the daily challenge and remembers it after a reload', async ({ page }) => {
  const { word } = dailyEntry(TODAY)
  await page.goto('./')

  await page.getByRole('button', { name: "Play today's word" }).click()
  for (const letter of new Set(word)) {
    await page.getByRole('button', { name: letter.toUpperCase(), exact: true }).click()
  }

  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('The word was')
  await expect(dialog).toContainText(word, { ignoreCase: true })
  await expect(dialog.getByRole('button', { name: /share result/i })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('button', { name: /solved/i })).toBeVisible()
})

test('loses a hard classic game using the physical keyboard', async ({ page }) => {
  // Math.random() → 0 makes the classic word deterministic: the first word in the bank.
  await page.addInitScript(() => {
    Math.random = () => 0
  })
  const { word } = ALL_WORDS[0]
  const misses = [...'zqxjvwkfbmdy'].filter((l) => !word.includes(l)).slice(0, 6)

  await page.goto('./')
  await page.getByText('Hard', { exact: true }).click()
  await page.getByRole('button', { name: /play/i }).last().click()
  await expect(page.getByRole('meter', { name: 'Lives left' })).toHaveAttribute('aria-valuenow', '6')

  for (const letter of misses) await page.keyboard.press(letter)

  await expect(page.getByRole('dialog')).toContainText('Out of lives')
  await page.getByRole('button', { name: 'Close' }).click()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('meter', { name: 'Lives left' })).toHaveAttribute('aria-valuenow', '6')
})
