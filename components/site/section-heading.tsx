"use client"

import { HyperLabel } from "@/components/ui/hyper-label"
import { cn } from "@/lib/utils"

/**
 * Section heading: an index label, a one-dot section mark, and a HyperText
 * title — it scrambles into place the first time it scrolls into view and
 * re-scrambles whenever the locale changes.
 */
export function SectionHeading({
  index,
  title,
  className,
}: {
  index?: string
  title: string
  className?: string
}) {
  return (
    <div data-drift className={cn("flex items-baseline gap-3", className)}>
      {index && (
        <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
          {index}
        </span>
      )}
      <span aria-hidden="true" className="bg-primary size-1.5 shrink-0 translate-y-[-2px] rounded-full" />
      <h2 className="text-foreground font-mono text-lg font-semibold tracking-wide uppercase sm:text-xl">
        <HyperLabel
          text={title}
          className="py-0 pb-0.5 align-baseline"
          duration={900}
        />
      </h2>
    </div>
  )
}
