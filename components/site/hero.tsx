"use client"

import { motion, useReducedMotion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { SonarGrid } from "@/components/ui/sonar-grid"
import { useLanguage } from "@/providers/language-provider"

const enter = (delay: number, reduce: boolean | null) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
      }

export function Hero() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()

  return (
    <SonarGrid
      id="top"
      className="min-h-svh w-full bg-background"
      spacing={26}
      ringWidth={86}
      speed={240}
      amplitude={2.1}
      pingArea={[0.18, 0.2, 0.82, 0.75]}
    >
      {/* A soft wash behind the copy keeps it legible while rings pass underneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_36%_32%_at_50%_50%,var(--color-background)_0%,transparent_100%)]"
      />

      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 py-28 text-center">
        <div className="flex max-w-2xl flex-col items-center">
          <motion.p
            {...enter(0, reduce)}
            className="border-border text-muted-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs tracking-wide"
          >
            <span aria-hidden="true" className="bg-primary size-1.5 rounded-full" />
            {t.person.eyebrow}
          </motion.p>

          <motion.h1
            {...enter(0.08, reduce)}
            className="font-heading text-5xl font-semibold tracking-tight text-balance sm:text-7xl"
          >
            {t.person.name}
          </motion.h1>

          <motion.p
            {...enter(0.14, reduce)}
            className="font-mono text-sm tracking-wide text-muted-foreground"
          >
            {t.person.role}
          </motion.p>

          <motion.p
            {...enter(0.2, reduce)}
            className="text-muted-foreground mt-6 max-w-xl text-base text-pretty sm:text-lg"
          >
            {t.person.lede}
          </motion.p>

          <motion.div
            {...enter(0.26, reduce)}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={t.hero.ctaPrimary.href}
              className="group bg-primary text-primary-foreground focus-visible:ring-ring/50 inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-medium shadow-sm transition-[transform,box-shadow] duration-200 outline-none hover:shadow-md focus-visible:ring-3 active:scale-[0.98]"
            >
              {t.hero.ctaPrimary.label}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href={t.hero.ctaSecondary.href}
              className="border-border text-foreground hover:bg-accent focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-lg border px-6 text-sm font-medium transition-[background-color,transform] duration-200 outline-none focus-visible:ring-3 active:scale-[0.98]"
            >
              {t.hero.ctaSecondary.label}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.p
        {...enter(0.4, reduce)}
        className="text-muted-foreground pointer-events-none absolute inset-x-0 bottom-6 px-4 pb-[env(safe-area-inset-bottom)] text-center font-mono text-[0.625rem] tracking-[0.18em] whitespace-nowrap uppercase sm:text-[0.6875rem] sm:tracking-widest max-sm:overflow-hidden"
      >
        {t.hero.hint}
      </motion.p>
    </SonarGrid>
  )
}
