import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { SettingsProvider } from './settings/SettingsProvider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        {/* Honour the OS "reduce motion" setting for every Motion animation in the tree. */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </SettingsProvider>
    </ErrorBoundary>
  </StrictMode>,
)
