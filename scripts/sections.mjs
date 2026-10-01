/**
 * Capture each section at full resolution, one file per section, so the result
 * can actually be reviewed by eye instead of as one unreadable tall image.
 */
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const theme = process.env.THEME || 'light'
const width = Number(process.env.W || 1440)
const height = Number(process.env.H || 900)
const out = `screenshots/${theme}-${width}`

await mkdir(out, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  colorScheme: theme,
})
const page = await context.newPage()
await page.goto(BASE)
await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme)

// fire every reveal
await page.evaluate(async () => {
  const step = window.innerHeight * 0.7
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 90))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(900)

const targets = [
  ['01-hero', '#top'],
  ['02-about', '#about'],
  ['03-work', '#work'],
  ['04-skills', '#skills'],
  ['05-log', '#log'],
  ['06-reach', '#reach'],
  ['07-footer', 'footer'],
]

for (const [name, selector] of targets) {
  const el = page.locator(selector).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(350)
  await el.screenshot({ path: `${out}/${name}.png` })
  console.log(`wrote ${out}/${name}.png`)
}

// header + open mobile nav, captured at the top
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(300)
await page.screenshot({ path: `${out}/00-viewport-top.png` })

await browser.close()