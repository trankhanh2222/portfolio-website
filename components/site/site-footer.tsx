"use client"

import type { Content } from "@/content/site"
import ShutterGlyphFooter from "@/components/ui/shutter-glyph-footer"
import { useLanguage } from "@/providers/language-provider"

/**
 * Client wrapper that feeds the footer its copy in the active locale. Props
 * stay serializable, so the underlying footer component remains unchanged.
 */
export function SiteFooter() {
  const { t } = useLanguage()
  const f: Content["footer"] = t.footer

  return (
    <ShutterGlyphFooter
      brand={t.person.nameAscii}
      wordmark={t.person.nameAscii}
      shutterAt={2}
      company={f.company}
      since={f.since}
      ctaLabel={f.cta.lede}
      ctaLinkLabel={f.cta.linkLabel}
      ctaUrl={f.cta.href}
      socials={f.socials.map((s) => ({
        label: s.name,
        href: s.href ?? undefined,
      }))}
      legal={f.legal.map((l) => ({
        label: l.name,
        href: l.href ?? undefined,
      }))}
    />
  )
}
