"use client"

import { Reveal } from "@/components/site/reveal"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

export function About() {
  const { t } = useLanguage()
  const { about } = t

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <SectionHeading index={about.index} title={about.title} />
        </Reveal>

        <div className="max-w-2xl">
          <div className="space-y-6">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.06 * i}>
                <p className="text-pretty leading-relaxed text-muted-foreground">{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18}>
            <dl className="border-border mt-10 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-4 border-t pt-8">
              {about.facts.map((fact) => (
                <div key={fact.name} className="contents">
                  <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {fact.name}
                  </dt>
                  <dd className="text-sm">
                    {fact.value ? fact.value : <Pending>{fact.ph}</Pending>}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
