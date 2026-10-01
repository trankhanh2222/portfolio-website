import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Static, frontend-only build. `base: './'` keeps assets relative so the dist
// folder can be dropped onto GitHub Pages, Netlify, or opened from any subpath.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})