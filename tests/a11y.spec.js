import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * WCAG 2.1 A and AA rules, run against the real production build in both themes.
 * The placeholder tokens and the muted mono notes are the likely pressure points,
 * which is why both themes are scanned rather than only the default one.
 */
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']

async function scan(page) {
  return new AxeBuilder({ page }).withTags(WCAG).analyze()
}

test('light theme has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const results = await scan(page)
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
})

test('dark theme has no accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
  await page.waitForLoadState('networkidle')
  const results = await scan(page)
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    nodes: v.nodes.map((n) => n.target.join(' ')),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
})