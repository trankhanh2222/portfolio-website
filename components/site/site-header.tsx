"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { MorphText } from "@/components/ui/morph-text"
import { useLanguage } from "@/providers/language-provider"
import { useTheme } from "next-themes"

function MonoButton({ className, children, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={
        "inline-flex h-9 items-center justify-center rounded-full border border-border px-3 font-mono text-xs tracking-wide text-foreground transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none " +
        (className ?? "")
      }
      {...props}
    >
      {children}
    </button>
  )
}

export function SiteHeader() {
  const { t, locale, toggle } = useLanguage()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  // next-themes' resolvedTheme is only known after hydration; passing it to
  // the toggler before then would flip its icon between server HTML and the
  // hydration pass.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted gate: resolvedTheme only exists after hydration
    setMounted(true)
  }, [])

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const navLinks = t.nav.map((item) => (
    <a
      key={item.href}
      href={item.href}
      className="hidden rounded-lg px-3 py-2 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
    >
      <MorphText text={item.label} />
    </a>
  ))

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      {/* Skip link: the first focusable element on the page. Hidden until focused. */}
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only rounded-lg px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:shadow-md focus:outline-none"
      >
        {t.ui.skipToContent}
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="inline-flex items-center gap-2 font-medium">
          <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
          <MorphText text={t.person.name} />
        </a>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {navLinks}

          <div className="ml-3 flex items-center gap-2">
            <MonoButton onClick={toggle} aria-label={t.ui.langSwitchAria}>
              {/* Shows the language you would switch to. */}
              <span aria-hidden="true">
                <MorphText text={locale === "en" ? "VI" : "EN"} className="min-w-6 text-center" />
              </span>
            </MonoButton>

            <AnimatedThemeToggler
              variant="circle"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_svg]:size-4"
              theme={mounted ? (resolvedTheme === "dark" ? "dark" : "light") : undefined}
              onThemeChange={(theme) => setTheme(theme)}
              aria-label={t.ui.themeToggleAria}
            />

            <MonoButton
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label={t.ui.menuOpen}
              aria-expanded={open}
            >
              <Menu className="size-4" />
            </MonoButton>
          </div>
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex h-16 items-center justify-between px-6">
            <span className="inline-flex items-center gap-2 font-medium">
              <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
              {t.person.name}
            </span>
            <MonoButton onClick={() => setOpen(false)} aria-label={t.ui.menuClose}>
              <X className="size-4" />
            </MonoButton>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col items-center justify-center gap-6">
            {t.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-heading text-2xl font-semibold tracking-tight"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
