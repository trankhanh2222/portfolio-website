import { chromium } from '@playwright/test'

const b = await chromium.launch()
for (const cs of ['light', 'dark']) {
  const ctx = await b.newContext({ colorScheme: cs, viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto('http://localhost:4173/')
  await p.waitForTimeout(400)
  const attr = await p.evaluate(() => document.documentElement.getAttribute('data-theme'))
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
  console.log(`colorScheme=${cs} -> data-theme=${attr} bodyBg=${bg}`)
  await ctx.close()
}
await b.close()