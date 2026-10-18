"use client"

import * as React from "react"
import { gsap, ScrollSmoother, useGSAP, prefersReducedMotion } from "@/lib/gsap"

/**
 * SmoothScroll — inertial scrolling for pointer devices, via ScrollSmoother.
 *
 * The wrapper/content pair wraps ONLY the in-flow page (sections + footer);
 * every fixed layer (backdrop, progress bar, header) must stay outside the
 * wrapper or its position:fixed breaks inside a transformed subtree.
 *
 * Created only for fine pointers from md up, never under reduced motion —
 * everything below that renders as a plain passthrough. While active, the
 * CSS `scroll-behavior: smooth` on <html> is disabled (programmatic anchor
 * jumps would double-smooth against the smoother's own easing) and restored
 * on cleanup.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()

    mm.add("(pointer: fine) and (min-width: 768px)", () => {
      const html = document.documentElement
      const previousBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = "auto"

      const smoother = ScrollSmoother.create({
        wrapper: ref.current,
        content: ref.current?.querySelector("[data-smooth-content]"),
        smooth: 0.9,
        effects: false,
        smoothTouch: false,
      })

      // ScrollSmoother replaces the document's scrolling box with a fixed
      // wrapper, so native hash navigation no longer scrolls. Intercept hash
      // links and route them through the smoother (smoothed), honoring
      // scroll-margin-top; the hash still lands in the URL.
      const onClick = (e: MouseEvent) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        const link = (e.target as HTMLElement | null)?.closest?.("a[href^='#']")
        const hash = link?.getAttribute("href")
        if (!link || !hash || hash.length < 2) return
        const target = document.querySelector(hash)
        if (!target) return
        e.preventDefault()
        const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0
        smoother.scrollTo(target.getBoundingClientRect().top + window.scrollY - margin, true)
        history.pushState(null, "", hash)
      }
      document.addEventListener("click", onClick)

      return () => {
        document.removeEventListener("click", onClick)
        smoother.kill()
        html.style.scrollBehavior = previousBehavior
      }
    })

    return () => mm.revert()
  }, {})

  return (
    <div ref={ref} data-smooth-wrapper>
      <div data-smooth-content>{children}</div>
    </div>
  )
}
