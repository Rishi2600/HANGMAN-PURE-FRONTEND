import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no canvas, so the confetti library is stubbed out.
vi.mock('canvas-confetti', () => ({ default: vi.fn() }))

// jsdom doesn't implement matchMedia; theme + reduced-motion checks need it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
