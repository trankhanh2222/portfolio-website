"use client"

import { MorphText } from "@/components/ui/morph-text"
import { cn } from "@/lib/utils"

/**
 * Section heading: an index label, a one-dot section mark, and a morphing
 * title (languages change without a layout jump).
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
    <div className={cn("flex items-baseline gap-3", className)}>
      {index && (
        <span aria-hidden="true" className="font-mono text-xs text-muted-foreground">
          {index}
        </span>
      )}
      <span aria-hidden="true" className="bg-primary size-1.5 shrink-0 translate-y-[-2px] rounded-full" />
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        <MorphText text={title} className="align-baseline" />
      </h2>
    </div>
  )
}
