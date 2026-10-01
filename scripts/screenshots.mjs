/**
 * Capture screenshots of the built site for visual review.
 *
 *   npm run build && npm run preview   # in one terminal
 *   node scripts/screenshots.mjs       # in another
 *
 * Writes to ./screenshots (gitignored). Desktop light/dark plus a mobile pass.
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const OUT = 'screenshots'

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()

const shots = [
  { name: 'desktop-light', viewport: { width: 1440, height: 900 }, theme: 'light' },
  { name: 'desktop-dark', viewport: { width: 1440, height: 900 }, theme: 'dark' },
  { name: 'mobile-light', viewport: { width: 390, height: 844 }, theme: 'light' },
  { name: 'mobile-dark', viewport: { width: 390, height: 844 }, theme: 'dark' },
]

for (const shot of shots) {
  const context = await browser.newContext({ viewport: shot.viewport })
  const page = await context.newPage()
  await page.goto(BASE)
  await page.evaluate((theme) => document.documentElement.setAttribute('data-theme', theme), shot.theme)
  // scroll through so every IntersectionObserver reveal has fired
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: true })
  console.log(`wrote ${OUT}/${shot.name}.png`)
  await context.close()
}

await browser.close()