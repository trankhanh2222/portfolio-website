"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"

/**
 * Magnetic — wraps an interactive element and lets the pointer gently pull
 * it toward itself (clamped to a few pixels), releasing with an elastic
 * settle on leave. Transform-only, so it composes with the child's own
 * hover/active styles and never touches layout. Fine pointers only;
 * reduced-motion users get a plain wrapper.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
  maxShift = 6,
}: {
  children: React.ReactNode
  className?: string
  /** Fraction of the pointer's offset-from-center applied to the shift. */
  strength?: number
  /** Hard clamp on the shift, in pixels, so the pull stays a nudge. */
  maxShift?: number
}) {
  const ref = React.useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      gsap.to(el, {
        x: gsap.utils.clamp(-maxShift, maxShift, dx * strength),
        y: gsap.utils.clamp(-maxShift, maxShift, dy * strength),
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      })
    }
    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
        overwrite: "auto",
      })
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      gsap.killTweensOf(el)
    }
  }, {})

  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  )
}
