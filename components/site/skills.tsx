"use client"

import { useRef } from "react"
import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HyperLabel } from "@/components/ui/hyper-label"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
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
  const sectionRef = useRef<HTMLElement>(null)

  // Tilt-on-hover: the whole row leans toward the pointer in 3D (≤ 8° pitch,
  // ≤ 10° yaw, a 14px lift), transform-only. GSAP owns the inner pad's
  // transform so it never fights motion/react's entrance on the li.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      if (!window.matchMedia("(pointer: fine)").matches) return

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((row) => {
        gsap.set(row, { transformPerspective: 900 })
        const rx = gsap.quickTo(row, "rotationX", { duration: 0.4, ease: "power3.out" })
        const ry = gsap.quickTo(row, "rotationY", { duration: 0.4, ease: "power3.out" })
        const tz = gsap.quickTo(row, "z", { duration: 0.4, ease: "power3.out" })

        const onMove = (e: PointerEvent) => {
          const rect = row.getBoundingClientRect()
          const px = (e.clientX - rect.left) / rect.width - 0.5
          const py = (e.clientY - rect.top) / rect.height - 0.5
          rx(py * -8)
          ry(px * 10)
          tz(14)
        }
        const onLeave = () => {
          rx(0)
          ry(0)
          tz(0)
        }

        row.addEventListener("pointermove", onMove)
        row.addEventListener("pointerleave", onLeave)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="skills" className="scroll-mt-24 py-14 sm:py-20">
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
                  className="border-border border-t"
                >
                  <div
                    data-tilt
                    className="grid gap-2 py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_max-content] sm:items-baseline sm:gap-8"
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
                  </div>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
