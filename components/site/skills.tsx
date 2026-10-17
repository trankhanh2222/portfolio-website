"use client"

import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HyperLabel } from "@/components/ui/hyper-label"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"
import { cn } from "@/lib/utils"

const STEPS = 4

const cellVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.05 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const rowVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function TierMeter({ label, level }: { label: string; level: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`${label} ${level}/${STEPS}`}>
      <span aria-hidden="true" className="font-mono text-[0.6875rem] tracking-widest uppercase text-muted-foreground">
        <HyperLabel text={label} className="py-0" duration={500} />
      </span>
      <span aria-hidden="true" className="inline-flex gap-1">
        {Array.from({ length: STEPS }).map((_, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={cellVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className={cn(
              "bg-border size-2 rounded-[2px]",
              i < level && "bg-primary",
            )}
          />
        ))}
      </span>
    </span>
  )
}

export function Skills() {
  const { t } = useLanguage()
  const { skills } = t

  return (
    <section id="skills" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
        <BlurFade inView direction="up">
          <SectionHeading index={skills.index} title={skills.title} />
        </BlurFade>

        <div className="max-w-3xl">
          <BlurFade inView direction="up">
            <p className="text-muted-foreground mb-6 text-sm">
              <HyperLabel text={skills.note} className="py-0" duration={1000} />
            </p>
          </BlurFade>

          <ul className="border-border border-b">
            {skills.rows.map((row, i) => {
              const tier = skills.tiers[row.tier]
              return (
                <motion.li
                  key={row.name}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="border-border grid gap-2 border-t py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_max-content] sm:items-baseline sm:gap-8"
                >
                  <span className="font-medium">
                    <HyperLabel text={row.name} className="py-0" duration={700} />
                  </span>
                  <span className="text-muted-foreground text-sm">
                    <HyperLabel text={row.detail} className="py-0" duration={1000} delay={140} />
                  </span>
                  <span className="sm:justify-self-end">
                    <TierMeter label={tier.label} level={tier.level} />
                  </span>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
