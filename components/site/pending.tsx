import { cn } from "@/lib/utils"
import { HyperLabel } from "@/components/ui/hyper-label"

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
      {typeof children === "string" ? (
        <HyperLabel text={children} className="py-0" duration={700} />
      ) : (
        children
      )}
    </span>
  )
}
