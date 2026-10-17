import { cn } from "@/lib/utils"

/**
 * A visible "content pending" token. Facts the owner has not supplied render
 * as this instead of being filled with invented copy.
 */
export function Pending({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.8125rem] tracking-wide text-muted-foreground decoration-border underline decoration-dashed underline-offset-4",
        className,
      )}
    >
      {children}
    </span>
  )
}
