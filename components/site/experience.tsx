"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Experience() {
  const { t } = useLanguage()
  const { experience, ui } = t

  // The rail fills as the list scrolls through the viewport: scroll-linked,
  // eased with a spring. (Basic whileInView is everywhere else.)
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 60%"],
  })
  const railProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="experience" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
        <BlurFade inView direction="up">
          <SectionHeading index={experience.index} title={experience.title} />
          <p className="text-muted-foreground mt-3 max-w-48 text-sm">{experience.note}</p>
        </BlurFade>

        <div className="relative max-w-3xl">
          {/* Timeline rail: track + scroll-linked progress. */}
          <div aria-hidden="true" className="from-border absolute inset-y-1 -left-4 w-px bg-linear-to-b sm:-left-7" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: railProgress }}
            className="bg-primary absolute inset-y-1 -left-4 w-px origin-top sm:-left-7"
          />

          <ol ref={listRef} className="pl-5 sm:pl-8">
            {experience.items.map((item, i) => (
              <motion.li
                key={item.id}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-48px" }}
                className="py-6 first:pt-0 sm:py-7"
              >
                <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
                  <div className="font-mono text-sm text-muted-foreground">
                    {item.year ? <time>{item.year}</time> : <Pending>{item.yearPh}</Pending>}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                        {item.title ? item.title : <Pending>{item.titlePh}</Pending>}
                      </h3>
                      {item.title === null && (
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide">
                          {ui.templateStamp}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.org ? item.org : <Pending>{item.orgPh}</Pending>}
                    </p>
                    <p className="leading-relaxed mt-2">
                      {item.detail ? (
                        item.detail
                      ) : (
                        <Pending>{item.detailPh}</Pending>
                      )}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
