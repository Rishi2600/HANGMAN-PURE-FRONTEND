import { defineConfig, devices } from '@playwright/test'

const CI = !!process.env.CI
const url = 'http://localhost:4173/HANGMAN-PURE-FRONTEND/'
// Locally reuse the installed Google Chrome; CI installs Playwright's own Chromium.
const channel = CI ? undefined : 'chrome'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? 'github' : 'list',
  use: { baseURL: url, trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
  webServer: {
    command: 'npx vite build && npx vite preview --port 4173 --strictPort',
    url,
    reuseExistingServer: !CI,
    timeout: 120_000,
  },
})
