# Hangman

A fast, friendly Hangman game built with React. Pure frontend: no backend, no accounts, works offline.

**Play:** https://rishi2600.github.io/HANGMAN-PURE-FRONTEND/

## Features

- **Classic mode**: 6 categories (or mix them all), 3 difficulties
  - Easy: 10 lives, free hint
  - Medium: 8 lives, a hint costs a life
  - Hard: 6 lives, no hints
- **Daily challenge**: the same word for every player each day, with a Wordle-style emoji result to share
- **Score, streaks and stats** saved on your device. Refresh mid-game and you carry on where you left off.
- Animated SVG gallows, confetti, synthesised sound effects (mutable), and light and dark themes
- Play with the on-screen keyboard or a physical one (`Enter` starts a new game)
- Accessible: screen-reader announcements, focus-trapped dialogs, and support for the reduced-motion setting
- Installable PWA that works offline

## Tech stack

React 18 · TypeScript · Vite 7 · Tailwind CSS v4 · Motion · Vitest + Testing Library · Playwright · GitHub Actions + GitHub Pages

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173/HANGMAN-PURE-FRONTEND/
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Browser tests (Playwright; uses your installed Chrome locally) |

## Project structure

```
src/
  game/        pure game logic: reducer state machine, word bank, daily challenge, stats (unit-tested)
  components/  UI: screens, gallows, keyboard, modals, error boundary
  hooks/       useLocalStorage, usePhysicalKeyboard, useSound, useStableCallback
  settings/    theme + sound context
  lib/         storage, Web Audio sounds, confetti
e2e/           Playwright tests
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. Lint, type-check and unit tests
2. Playwright end-to-end tests
3. Build, upload `dist/` as a Pages artifact, and deploy it to GitHub Pages

Pull requests run the same checks without deploying.
