import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function bootstrap() {
  if (import.meta.env.VITE_USE_MSW === 'true') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ quiet: true })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
