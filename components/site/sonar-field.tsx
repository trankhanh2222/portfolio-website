"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { SonarGrid } from "@/components/ui/sonar-grid"
import { prefersReducedMotion } from "@/lib/gsap"

const SonarScene = dynamic(
  () => import("@/components/ui/sonar-scene").then((m) => m.SonarScene),
  { ssr: false },
)

/**
 * The sonar field as a fixed, full-page backdrop.
 *
 * It sits behind every section (fixed inset-0, -z-10) and listens for taps on
 * the window, so any click anywhere on the page launches a ring — the only
 * way waves appear: no ambient pings, no seeded ping. On fine pointers the
 * dots also glow under the cursor (a trailing flashlight).
 *
 * Progressive dispatch: the 2D canvas renders on the server and on first
 * paint (zero hydration risk), then — only for fine pointers at md and up
 * without reduced motion — the 3D point-plane scene lazily takes over
 * (three.js is dynamically imported, so it never sits in the initial chunk).
 * Touch, small screens and reduced motion keep the 2D field for good.
 */
export function SonarField() {
  const [use3d, setUse3d] = React.useState(false)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia("(pointer: fine)").matches) return
    if (!window.matchMedia("(min-width: 768px)").matches) return
    setUse3d(true)
  }, [])

  if (use3d) {
    return <SonarScene className="pointer-events-none fixed inset-0 -z-10" />
  }

  return (
    <SonarGrid
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      listenOn="window"
      interactive
      followCursor
      pingEvery={0}
      seedPing={false}
      spacing={26}
      ringWidth={86}
      speed={240}
      amplitude={2.1}
    />
  )
}
