"use client"

import { SonarGrid } from "@/components/ui/sonar-grid"

/**
 * The sonar field as a fixed, full-page backdrop.
 *
 * It sits behind every section (fixed inset-0, -z-10) and listens for taps on
 * the window, so any click anywhere on the page launches a ring — the only
 * way waves appear: no ambient pings, no seeded ping. On fine pointers the
 * dots also glow under the cursor (a trailing flashlight; the grid skips it
 * for touch and reduced-motion users).
 */
export function SonarField() {
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
