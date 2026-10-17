"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { HyperLabel } from "@/components/ui/hyper-label"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

export function About() {
  const { t } = useLanguage()
  const { about } = t

  return (
    <section id="about" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
        <BlurFade inView direction="up">
          <SectionHeading index={about.index} title={about.title} />
        </BlurFade>

        <div className="max-w-2xl">
          <div className="space-y-5">
            {about.paragraphs.map((p, i) => (
              <BlurFade key={i} inView direction="up" delay={0.05 * i}>
                <p className="text-pretty leading-relaxed text-muted-foreground">
                  <HyperLabel text={p} className="py-0" duration={1300} delay={120 * i} />
                </p>
              </BlurFade>
            ))}
          </div>

          <BlurFade inView direction="up" delay={0.14}>
            <dl className="border-border mt-8 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-3.5 border-t pt-6">
              {about.facts.map((fact) => (
                <div key={fact.name} className="contents">
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <HyperLabel text={fact.name} className="py-0" duration={600} />
                  </dt>
                  <dd className="text-sm">
                    {fact.value ? <HyperLabel text={fact.value} className="py-0" duration={900} /> : <Pending>{fact.ph}</Pending>}
                  </dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
