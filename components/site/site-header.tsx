"use client"

import { useEffect, useState } from "react"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { HyperLabel } from "@/components/ui/hyper-label"
import { KineticNavigation } from "@/components/ui/kinetic-navigation"
import { Pending } from "@/components/site/pending"
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

  // next-themes' resolvedTheme is only known after hydration; passing it to
  // the toggler before then would flip its icon between server HTML and the
  // hydration pass.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mounted gate: resolvedTheme only exists after hydration
    setMounted(true)
  }, [])

  const links = t.nav.map((item) => ({
    href: item.href,
    label: (
      // Scrambles through HyperText only when the locale changes.
      <HyperLabel text={item.label} className="py-0" duration={700} />
    ),
  }))

  const controls = (
    <div className="flex items-center gap-2">
      <MonoButton onClick={toggle} aria-label={t.ui.langSwitchAria}>
        {/* Shows the language you would switch to. */}
        <span aria-hidden="true">
          <HyperLabel
            text={locale === "en" ? "VI" : "EN"}
            className="min-w-6 py-0 text-center"
            duration={400}
          />
        </span>
      </MonoButton>

      <AnimatedThemeToggler
        variant="circle"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&_svg]:size-4"
        theme={mounted ? (resolvedTheme === "dark" ? "dark" : "light") : undefined}
        onThemeChange={(theme) => setTheme(theme)}
        aria-label={t.ui.themeToggleAria}
      />
    </div>
  )

  // Secondary column inside the fullscreen menu: direct line, the footer's
  // social trio, credit. Everything unresolved renders as Pending tokens.
  // The credit year comes from content (footer.since) — a clock read would
  // be an unstable value during prerender under Cache Components.
  const meta = (
    <>
      <div data-menu-fade>
        <p className="menu-meta-label">{t.menu.touch}</p>
        <div className="menu-meta-row">
          {t.contact.email ? (
            <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
          ) : (
            <Pending>{t.contact.emailPh}</Pending>
          )}
        </div>
      </div>
      <div data-menu-fade>
        <p className="menu-meta-label">{t.menu.elsewhere}</p>
        {t.footer.socials.map((social) => (
          <div key={social.name} className="menu-meta-row">
            <span>
              <HyperLabel text={social.name} className="py-0" duration={600} />
            </span>
            {social.href ? (
              <a href={social.href}>{social.name}</a>
            ) : (
              <Pending>{social.ph}</Pending>
            )}
          </div>
        ))}
      </div>
      <p className="menu-meta-credit" data-menu-fade>
        © {t.footer.since} · {t.person.name}
      </p>
    </>
  )

  return (
    <KineticNavigation
      preNav={
        /* Skip link: the first focusable element on the page. Hidden until focused. */
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only rounded-lg px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:shadow-md focus:outline-none"
        >
          {t.ui.skipToContent}
        </a>
      }
      logo={
        <>
          <span aria-hidden="true" className="bg-primary size-2 rounded-full" />
          {t.person.name}
        </>
      }
      links={links}
      controls={controls}
      meta={meta}
      openLabel={t.ui.menuOpen}
      closeLabel={t.ui.menuClose}
    />
  )
}
