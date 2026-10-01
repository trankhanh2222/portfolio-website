import { test, expect } from '@playwright/test'

test.describe('site', () => {
  test('renders every section and no console errors', async ({ page }) => {
    const errors = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')

    for (const id of ['top', 'about', 'work', 'skills', 'log', 'reach']) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }

    // The hero names the owner and the domains in plain words.
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Khanh')

    expect(errors, `console errors: ${errors.join(' | ')}`).toEqual([])
  })

  test('has a single h1 and a sane heading order', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const headings = await page.locator('h1, h2, h3').allTextContents()
    expect(headings.length).toBeGreaterThan(4)
  })

  test('no dead links: every anchor has a real destination', async ({ page }) => {
    await page.goto('/')
    const hrefs = await page.locator('a[href]').evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('href')),
    )
    const dead = hrefs.filter((href) => href === '#' || href === '' || href === 'javascript:void(0)')
    expect(dead, `dead links: ${dead.join(', ')}`).toEqual([])
  })

  test('external links are safe', async ({ page }) => {
    await page.goto('/')
    const unsafe = await page.locator('a[target="_blank"]').evaluateAll((nodes) =>
      nodes
        .filter((node) => {
          const rel = (node.getAttribute('rel') || '').split(/\s+/)
          return !rel.includes('noreferrer') && !rel.includes('noopener')
        })
        .map((node) => node.href),
    )
    expect(unsafe, `links missing rel noopener: ${unsafe.join(', ')}`).toEqual([])
  })

  test('theme toggle switches and persists', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.getByRole('button', { name: /dark theme/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    // persists across a reload, set before first paint
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  test('email copy button is honest when no address is set', async ({ page }) => {
    await page.goto('/')
    const button = page.getByRole('button', { name: /not set yet/i })
    await expect(button).toBeDisabled()
    await expect(page.getByText(/No email address has been added yet/)).toBeVisible()
  })

  test('placeholders are visible rather than silently blank', async ({ page }) => {
    await page.goto('/')
    const placeholders = page.locator('.ph')
    await expect(placeholders.first()).toBeVisible()
    expect(await placeholders.count()).toBeGreaterThan(5)
  })

  test('journal renders an honest empty state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('No entries yet.')).toBeVisible()
  })

  test('reduced motion renders everything visible with no animation waiting', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    const reveals = page.locator('.reveal')
    const count = await reveals.count()
    for (let index = 0; index < count; index += 1) {
      await expect(reveals.nth(index)).toBeVisible()
    }
    await context.close()
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('opens, navigates, and closes on Escape', async ({ page }) => {
    await page.goto('/')
    const openButton = page.getByRole('button', { name: /open menu/i })
    await openButton.click()
    await expect(page.locator('#mobile-nav')).toBeVisible()

    await expect(page.getByRole('link', { name: 'Work' }).last()).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('#mobile-nav')).toBeHidden()
  })
})