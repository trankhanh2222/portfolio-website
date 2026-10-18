"use client"

import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"

/**
 * ScrollChoreography — one page-level client component owning the subtle
 * scroll-linked counter-motion: each section's heading rail drifts slowly
 * against the scroll while its content flows normally (counter-motion at a
 * fraction of the speed, per the motion-design 1/3 rule). Content entrances
 * stay on the existing BlurFade ladder; this layer only adds the drift.
 * Renders nothing; reduced motion skips the whole effect.
 */
export function ScrollChoreography() {
  useGSAP(() => {
    if (prefersReducedMotion()) return

    gsap.utils.toArray<HTMLElement>("main > section[id]").forEach((section) => {
      const rail = section.querySelector("[data-drift]")
      if (!rail) return
      gsap.fromTo(
        rail,
        { y: 12 },
        {
          y: -28,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 0.5,
          },
        },
      )
    })
  }, {})

  return null
}
