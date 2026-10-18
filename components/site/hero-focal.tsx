"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { prefersReducedMotion } from "@/lib/gsap"

const HeroShard = dynamic(
  () => import("@/components/ui/hero-shard").then((m) => m.HeroShard),
  { ssr: false },
)

/**
 * HeroFocal — the crystal layer behind the hero copy.
 *
 * Progressive and experimental: renders nothing on touch pointers, small
 * screens or reduced motion; only fine-pointer desktops lazily pull the
 * three.js scene (never in the initial chunk). Sits between the radial
 * wash and the copy — source order keeps it above the wash and below the
 * (transformed, therefore stacking-context) hero text.
 */
export function HeroFocal() {
  const [on, setOn] = React.useState(false)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (!window.matchMedia("(min-width: 768px)").matches) return
    setOn(true)
  }, [])

  if (!on) return null

  return (
    <div
      aria-hidden="true"
      data-slot="hero-focal"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div className="relative h-[min(70vh,640px)] w-[min(70vh,640px)]">
        <HeroShard className="absolute inset-0" />
      </div>
    </div>
  )
}
