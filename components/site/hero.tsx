"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"
import { HyperLabel } from "@/components/ui/hyper-label"
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap"

/**
 * Hero — one master timeline choreographs the whole fold:
 *
 *   badge → wordmark (SplitText chars rise out of masks) → role → lede → CTAs → hint
 *
 * with each layer overlapping the previous by ~60% (staging: the wordmark is
 * the hero element and lands first). Replacing the old per-element fade
 * ladder. The name never changes between locales, so the split is done once;
 * the HyperLabel spans inside the other layers keep handling language swaps.
 */
export function Hero() {
  const { t } = useLanguage()
  const sectionRef = React.useRef<HTMLElement>(null)
  const nameRef = React.useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return // everything renders visible, untouched

      const split = SplitText.create(nameRef.current, {
        type: "chars",
        mask: "chars",
        aria: "auto",
      })

      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]")

      gsap.set(fades, { autoAlpha: 0, y: 18, filter: "blur(6px)" })

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      // The wordmark is the hero element: it leads, out of its masks, with a
      // fast-start ease (the "main" in-out curve stalls too long for a first
      // impression). Supporting layers fade in behind it, overlapping.
      tl.from(split.chars, { yPercent: 118, duration: 0.9, stagger: 0.05, ease: "power4.out" }, 0)
        .to(fades, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.08 }, 0.08)

      return () => split.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* A soft wash behind the copy keeps it legible while rings pass underneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_42%_38%_at_50%_50%,var(--color-background)_0%,transparent_100%)]"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-28 text-center">
        <div className="flex max-w-2xl flex-col items-center">
          <p
            data-hero-fade
            className="border-border text-muted-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs tracking-wide"
          >
            <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
            <HyperLabel text={t.person.eyebrow} className="py-0" duration={600} />
          </p>

          <h1
            ref={nameRef}
            className="font-heading text-5xl font-semibold tracking-tight text-balance sm:text-7xl"
          >
            {t.person.name}
          </h1>

          <p
            data-hero-fade
            className="font-mono text-sm tracking-wide text-muted-foreground"
          >
            <HyperLabel text={t.person.role} className="py-0" duration={600} />
          </p>

          <p
            data-hero-fade
            className="text-muted-foreground mt-6 max-w-xl text-base text-pretty sm:text-lg"
          >
            <HyperLabel text={t.person.lede} className="py-0" duration={1400} />
          </p>

          <div
            data-hero-fade
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={t.hero.ctaPrimary.href}
              className="group bg-primary text-primary-foreground focus-visible:ring-ring/50 inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium shadow-sm transition-[transform,box-shadow] duration-200 outline-none hover:shadow-md focus-visible:ring-3 active:scale-[0.98]"
            >
              <HyperLabel text={t.hero.ctaPrimary.label} className="py-0" duration={600} />
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={t.hero.ctaSecondary.href}
              className="border-border text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-[background-color,transform] duration-200 outline-none focus-visible:ring-3 active:scale-[0.98]"
            >
              <HyperLabel text={t.hero.ctaSecondary.label} className="py-0" duration={600} />
            </a>
          </div>
        </div>
      </div>

      <p
        data-hero-fade
        className="text-muted-foreground pointer-events-none absolute inset-x-0 bottom-6 px-4 pb-[env(safe-area-inset-bottom)] text-center font-mono text-[0.625rem] tracking-[0.18em] whitespace-nowrap uppercase sm:text-[0.6875rem] sm:tracking-widest max-sm:overflow-hidden"
      >
        <HyperLabel text={t.hero.hint} className="py-0" duration={700} />
      </p>
    </section>
  )
}
