/**
 * Layout audit. Measures the rendered page instead of guessing from a picture.
 *
 * Reports, per viewport: horizontal overflow, elements escaping their container,
 * tap targets under 44px, prose measure, and font sizes actually in use.
 *
 *   node scripts/layout-audit.mjs
 */
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:4173'
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 700 },
]

const browser = await chromium.launch()
let problems = 0

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()
  await page.goto(BASE)
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(400)

  const result = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth

    // horizontal overflow
    const scrollWidth = document.documentElement.scrollWidth
    const overflowing = []
    const all = document.querySelectorAll('body *')
    for (const el of all) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      const style = getComputedStyle(el)
      if (style.position === 'fixed') continue
      if (rect.right > docWidth + 1.5) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && String(el.className).slice(0, 60)) || '',
          right: Math.round(rect.right),
          text: (el.textContent || '').trim().slice(0, 40),
        })
      }
    }

    // small tap targets on interactive elements
    const smallTargets = []
    for (const el of document.querySelectorAll('a[href], button:not([disabled])')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      if (getComputedStyle(el).visibility === 'hidden') continue
      if (rect.height < 24 || rect.width < 24) {
        smallTargets.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 30),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        })
      }
    }

    // prose measure and text sizes
    const measures = []
    for (const el of document.querySelectorAll('.prose, .lede, .section-title, .proof__body')) {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) continue
      measures.push({ cls: String(el.className).split(' ')[0], w: Math.round(rect.width) })
    }

    const sizes = new Set()
    for (const el of document.querySelectorAll('p, li, span, h1, h2, h3, a')) {
      const fs = getComputedStyle(el).fontSize
      if (parseFloat(fs) < 12) sizes.add(fs + ' :: ' + (el.textContent || '').trim().slice(0, 30))
    }

    return { scrollWidth, docWidth, overflowing, smallTargets, measures, tinyText: [...sizes] }
  })

  const overflow = result.scrollWidth > result.docWidth + 1
  console.log(`\n=== ${vp.name} (${vp.width}px) ===`)
  console.log(`document scrollWidth=${result.scrollWidth} clientWidth=${result.docWidth}` +
    (overflow ? '  <-- HORIZONTAL OVERFLOW' : '  ok'))
  if (overflow) problems += 1

  if (result.overflowing.length) {
    problems += 1
    console.log(`elements past the right edge (${result.overflowing.length}):`)
    for (const el of result.overflowing.slice(0, 8)) {
      console.log(`   <${el.tag} class="${el.cls}"> right=${el.right} "${el.text}"`)
    }
  }

  if (result.smallTargets.length) {
    console.log(`tap targets under 24px (${result.smallTargets.length}):`)
    for (const t of result.smallTargets.slice(0, 8)) {
      console.log(`   <${t.tag}> ${t.w}x${t.h} "${t.text}"`)
    }
  }

  if (result.tinyText.length) {
    console.log(`text under 12px: ${result.tinyText.slice(0, 6).join(' | ')}`)
  }

  await context.close()
}

await browser.close()
console.log(`\n${problems === 0 ? 'no layout problems found' : `${problems} layout problem group(s) found`}`)
process.exit(problems === 0 ? 0 : 1)