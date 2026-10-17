"use client"

import { Reveal } from "@/components/site/reveal"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

export function Experience() {
  const { t } = useLanguage()
  const { experience, ui } = t

  return (
    <section id="experience" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <SectionHeading index={experience.index} title={experience.title} />
          <p className="text-muted-foreground mt-4 max-w-48 text-sm">{experience.note}</p>
        </Reveal>

        <ol className="max-w-3xl">
          {experience.items.map((item) => (
            <li key={item.id} className="border-border border-t py-8 first:border-t-0 sm:py-10">
              <Reveal>
                <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
                  <div className="font-mono text-sm text-muted-foreground">
                    {item.year ? <time>{item.year}</time> : <Pending>{item.yearPh}</Pending>}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-heading text-lg font-semibold tracking-tight">
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
                    <p className="leading-relaxed mt-3">
                      {item.detail ? (
                        item.detail
                      ) : (
                        <Pending>{item.detailPh}</Pending>
                      )}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
