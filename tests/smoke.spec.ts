import { expect, test } from "@playwright/test"

const LANG_TEXT = {
  // Heading labels render uppercase after a HyperText scramble (the scramble
  // transforms the actual characters), so VI/EN-after-change are uppercase.
  about: { en: "About", vi: "GIỚI THIỆU" },
  navvi: "KỸ NĂNG",
  contactPh: { en: "[ email address ]", vi: "[ địa chỉ email ]" },
  langAria: {
    en: "Switch to Vietnamese",
    vi: "Chuyển sang tiếng Anh",
  },
}

test.describe("portfolio smoke", () => {
  test("renders the full page structure", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/Khanh/)

    // Hero copy
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Khanh")

    // Sections exist
    for (const id of ["about", "skills", "experience", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached()
    }

    // Sonar field canvas mounts behind the hero
    await expect(page.locator('[data-slot="sonar-grid"] canvas')).toBeVisible()

    // Footer: wordmark svg + shutter glyph rows
    await expect(page.locator("footer.sgf .sgf-svg")).toBeVisible()

    // Honest placeholders render — nothing fake is filled in
    await expect(page.locator("#contact")).toContainText(LANG_TEXT.contactPh.en)
    await expect(page.locator("#contact")).toContainText("[ GitHub URL ]")
  })

  test("language toggle morphs labels and persists", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("#about h2")).toContainText(LANG_TEXT.about.en)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")

    await page.getByRole("button", { name: LANG_TEXT.langAria.en, exact: true }).click()
    await expect(page.locator("#about h2")).toContainText(LANG_TEXT.about.vi, { timeout: 5_000 })
    await expect(page.locator("html")).toHaveAttribute("lang", "vi")
    await page.reload()
    await expect(page.locator("#about h2")).toContainText(LANG_TEXT.about.vi)
    await expect(page.locator("html")).toHaveAttribute("lang", "vi")

    // Back to English for the rest of the suite.
    await page.getByRole("button", { name: LANG_TEXT.langAria.vi, exact: true }).click()
    await expect(page.locator("#about h2")).toContainText("ABOUT", { timeout: 5_000 })
    await page.getByRole("button", { name: LANG_TEXT.langAria.en, exact: true }).click()
    await expect(page.locator("#about h2")).toContainText(LANG_TEXT.about.vi, { timeout: 5_000 })
  })

  test("theme toggle flips the color scheme and persists", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" })
    await page.goto("/")
    const html = page.locator("html")
    await expect(html).toHaveClass(/dark/)

    await page.getByRole("button", { name: "Toggle dark or light theme" }).click()
    await expect(html).not.toHaveClass(/dark/)
    await page.reload()
    await expect(html).not.toHaveClass(/dark/)

    await page.getByRole("button", { name: "Toggle dark or light theme" }).click()
    await expect(html).toHaveClass(/dark/)
    await page.reload()
    await expect(html).toHaveClass(/dark/)
  })

  test("keyboard users can reach the interactive bits", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // First Tab focuses the skip link; Enter jumps to <main>.
    await page.keyboard.press("Tab")
    await expect(page.locator('a[href="#main"]')).toBeFocused()
    await page.keyboard.press("Enter")

    // Next Tabs walk through the header controls (logo, nav, toggles) without
    // getting trapped.
    const focusable: string[] = []
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Tab")
      const el = await page.evaluate(() => {
        const f = document.activeElement as HTMLElement | null
        return f ? (f.getAttribute("aria-label") ?? f.getAttribute("aria-hidden") === "true" ? "(hidden)" : (f.textContent ?? "").slice(0, 30) || f.tagName) : "(none)"
      })
      focusable.push(el)
    }
    expect(focusable.filter((x) => x && x !== "(none)")).not.toHaveLength(0)
  })
})
