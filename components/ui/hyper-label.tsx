"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { HyperText } from "@/components/ui/hyper-text"
import { cn } from "@/lib/utils"

/**
 * HyperLabel — Magic UI's HyperText, driven by a value instead of a mount.
 *
 * The first render shows plain text, and every later change of `text`
 * (a locale switch) re-runs the scramble exactly once — immediately, no
 * matter where the label is on the page. Off-screen labels scramble
 * silently at the moment of the click and are settled by the time the
 * user scrolls there; nothing ever animates "late on scroll". A `key`
 * remount per change drives the replay, and `prefers-reduced-motion`
 * keeps the plain swap.
 */
export interface HyperLabelProps {
  text: string
  className?: string
  /** Scramble duration in ms (HyperText default 800). */
  duration?: number
  /** Extra delay before the scramble starts, in ms. */
  delay?: number
  animateOnHover?: boolean
}

export function HyperLabel({
  text,
  className,
  duration,
  delay,
  animateOnHover = false,
}: HyperLabelProps) {
  const [generation, setGeneration] = useState(0)
  const prevTextRef = useRef(text)
  const reduce = useReducedMotion()

  // Advance the generation key on every real text change so the HyperText
  // remounts and replays its scramble.
  useEffect(() => {
    if (prevTextRef.current === text) return
    prevTextRef.current = text
    setGeneration((generation) => generation + 1)
  }, [text])

  if (generation === 0 || reduce) {
    return <span className={cn("inline-block", className)}>{text}</span>
  }

  return (
    <HyperText
      key={generation}
      as="span"
      className={className}
      duration={duration}
      delay={delay}
      startOnView={false}
      animateOnHover={animateOnHover}
    >
      {text}
    </HyperText>
  )
}
