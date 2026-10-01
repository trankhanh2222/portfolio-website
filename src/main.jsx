import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts. No runtime request to a font CDN, and no layout shift from
// a swap that never resolves. Instrument Sans for prose and UI, IBM Plex Mono
// for code and labels.
import '@fontsource-variable/instrument-sans'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)