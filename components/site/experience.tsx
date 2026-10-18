"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HyperLabel } from "@/components/ui/hyper-label"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap"

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

  // Sonar motif on the rail: as the scroll progress passes a row for the
  // first time, a small ring expands from the rail at that row's midline.
  const sectionRef = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const wrapper = listRef.current?.parentElement
      if (!wrapper) return
      const railX = window.matchMedia("(min-width: 640px)").matches ? -28 : -16

      gsap.utils.toArray<HTMLElement>("ol > li").forEach((li) => {
        ScrollTrigger.create({
          trigger: li,
          start: "top 55%",
          once: true,
          onEnter: () => {
            const ring = document.createElement("span")
            ring.setAttribute("aria-hidden", "true")
            ring.style.cssText =
              "position:absolute;width:2.25rem;height:2.25rem;border-radius:9999px;border:1.5px solid var(--color-primary);pointer-events:none"
            wrapper.appendChild(ring)
            gsap.set(ring, {
              left: railX - 18,
              top: li.offsetTop + li.offsetHeight / 2 - 18,
            })
            gsap.fromTo(
              ring,
              { scale: 0.2, autoAlpha: 0.9 },
              {
                scale: 1.2,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power2.out",
                onComplete: () => ring.remove(),
              },
            )
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} id="experience" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
        <BlurFade inView direction="up">
          <SectionHeading index={experience.index} title={experience.title} />
          <p className="text-muted-foreground mt-3 max-w-48 text-sm">
            <HyperLabel text={experience.note} className="py-0" duration={1000} />
          </p>
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
                    {item.year ? (
                      <time>
                        <HyperLabel text={item.year} className="py-0" duration={500} />
                      </time>
                    ) : (
                      <Pending>{item.yearPh}</Pending>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                        {item.title ? (
                          <HyperLabel text={item.title} className="py-0" duration={800} />
                        ) : (
                          <Pending>{item.titlePh}</Pending>
                        )}
                      </h3>
                      {item.title === null && (
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide">
                          <HyperLabel text={ui.templateStamp} className="py-0" duration={600} />
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.org ? (
                        <HyperLabel text={item.org} className="py-0" duration={700} />
                      ) : (
                        <Pending>{item.orgPh}</Pending>
                      )}
                    </p>
                    <p className="leading-relaxed mt-2">
                      {item.detail ? (
                        <HyperLabel text={item.detail} className="py-0" duration={1300} delay={80} />
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
