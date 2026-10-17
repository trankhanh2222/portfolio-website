"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * MorphText — a one-shot, value-driven text morph.
 *
 * Magic UI's MorphingText loops through a `texts` array forever, which suits
 * a hero slogan but not a locale switch. This wrapper keeps the same
 * blur/fraction math (morphTime / cooldownTime, pow-0.4 opacity curves, the
 * shared `#threshold` SVG filter) but plays exactly one morph whenever the
 * `text` prop changes, then goes still. Prefers-reduced-motion swaps
 * instantly.
 *
 * The a11y text lives in a normal-flow "sizer" span; the two morphing layers
 * are aria-hidden overlays that only exist while the morph plays, so screen
 * readers announce the final label once.
 */

const morphTime = 0.9 // seconds for the swap itself

export interface MorphTextProps {
  text: string
  className?: string
}

export function MorphText({ text, className }: MorphTextProps) {
  const sizerRef = useRef<HTMLSpanElement>(null)
  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)

  const prevTextRef = useRef(text)
  const fromRef = useRef("")
  const [morphing, setMorphing] = useState(false)

  // Detect a value change and decide whether it can animate.
  useEffect(() => {
    if (prevTextRef.current === text) return
    fromRef.current = prevTextRef.current
    prevTextRef.current = text
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // First render (no previous text) or reduced motion: swap instantly.
    if (reduce || !fromRef.current) {
      fromRef.current = ""
      return
    }
    setMorphing(true)
  }, [text])

  // Run the single morph cycle once the overlay layers are committed.
  useEffect(() => {
    if (!morphing) return
    const current1 = text1Ref.current
    const current2 = text2Ref.current
    const sizer = sizerRef.current
    if (!current1 || !current2 || !sizer) {
      setMorphing(false)
      return
    }

    const from = fromRef.current
    const to = prevTextRef.current

    const setStyles = (fraction: number) => {
      // Outgoing layer.
      const inv = 1 - fraction
      current1.textContent = from
      current1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
      current1.style.opacity = `${Math.pow(inv, 0.4) * 100}%`
      // Incoming layer.
      current2.textContent = to
      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
    }

    let raf = 0
    const timeRef = { now: performance.now() }
    let morph = 0
    let cooldown = 0

    const tick = (now: number) => {
      const dt = (now - timeRef.now) / 1000
      timeRef.now = now
      cooldown -= dt
      if (cooldown <= 0) {
        morph += dt
        const fraction = morph / morphTime
        if (fraction >= 1) {
          finalize()
          return
        }
        setStyles(fraction)
      }
      raf = requestAnimationFrame(tick)
    }

    const finalize = () => {
      // Hand the settled label back to the sizer and drop the overlays.
      current2.style.filter = "none"
      current2.style.opacity = "0%"
      current1.style.filter = "none"
      current1.style.opacity = "0%"
      setMorphing(false)
      fromRef.current = ""
    }

    setStyles(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [morphing])

  return (
    <span
      className={cn("relative inline-block text-left", className)}
      // The threshold filter keeps the two overlapping layers crisp while
      // morphing. At rest the plain sizer renders — filtering would smear
      // small text (it is tuned for display sizes).
      style={morphing ? { filter: "url(#threshold) blur(0.6px)" } : undefined}
    >
      {/* Source of truth for a11y and layout. Hidden while overlays animate. */}
      <span
        ref={sizerRef}
        className={cn("inline-block whitespace-pre", morphing && "opacity-0")}
      >
        {text}
      </span>
      {morphing && (
        <>
          <span
            ref={text1Ref}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 inline-block whitespace-pre"
          />
          <span
            ref={text2Ref}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 inline-block whitespace-pre"
          />
        </>
      )}
    </span>
  )
}

export default MorphText
