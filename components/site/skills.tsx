"use client"

import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

const STEPS = 4

function TierMeter({ label, level }: { label: string; level: number }) {
  return (
    <span className="inline-flex items-center gap-2" aria-label={`${label} ${level}/${STEPS}`}>
      <span aria-hidden="true" className="font-mono text-[0.6875rem] tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      <span aria-hidden="true" className="inline-flex gap-1">
        {Array.from({ length: STEPS }).map((_, i) => (
          <span
            key={i}
            className={
              "size-2 rounded-[2px] transition-colors " +
              (i < level ? "bg-primary" : "bg-border")
            }
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
    <section id="skills" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <SectionHeading index={skills.index} title={skills.title} />
        </Reveal>

        <Reveal delay={0.08} className="max-w-3xl">
          <p className="text-muted-foreground mb-8 text-sm">{skills.note}</p>

          <ul className="border-border border-b">
            {skills.rows.map((row) => {
              const tier = skills.tiers[row.tier]
              return (
                <li
                  key={row.name}
                  className="border-border grid gap-2 border-t py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_max-content] sm:items-baseline sm:gap-8"
                >
                  <span className="font-medium">{row.name}</span>
                  <span className="text-muted-foreground text-sm">{row.detail}</span>
                  <span className="sm:justify-self-end">
                    <TierMeter label={tier.label} level={tier.level} />
                  </span>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
