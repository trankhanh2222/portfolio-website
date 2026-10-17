"use client"

import { useState } from "react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { Reveal } from "@/components/site/reveal"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

export function Contact() {
  const { t } = useLanguage()
  const { contact, ui } = t
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    if (!contact.email) return
    if (await copyText(contact.email)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-16">
        <Reveal>
          <SectionHeading index={contact.index} title={contact.title} />
        </Reveal>

        <div className="max-w-3xl">
          <Reveal>
            <p className="text-muted-foreground max-w-xl text-pretty leading-relaxed">
              {contact.lede}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex items-center gap-3">
              {contact.email ? (
                <code className="bg-card border-border inline-flex items-center rounded-lg border px-3 py-2 font-mono text-sm">
                  {contact.email}
                </code>
              ) : (
                <Pending>{contact.emailPh}</Pending>
              )}
              {contact.email && (
                <button
                  type="button"
                  onClick={onCopy}
                  aria-label={copied ? ui.copied : ui.copyEmail}
                  className="border-border hover:bg-accent focus-visible:ring-ring/50 inline-flex size-9 items-center justify-center rounded-full border transition-colors focus-visible:ring-3 focus-visible:outline-none"
                >
                  {copied ? <Check className="text-primary size-4" /> : <Copy className="size-4" />}
                </button>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <ul className="border-border mt-10 grid gap-x-12 border-b sm:grid-cols-2">
              {contact.links.map((link) =>
                link.href ? (
                  <li key={link.name} className="border-border border-t">
                    <a
                      href={link.href}
                      className="group border-border hover:bg-accent flex items-center justify-between border-t py-4 first:border-t-0 sm:-mt-px sm:border-t-0"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="text-muted-foreground transition-colors group-hover:text-primary size-4"
                      />
                    </a>
                  </li>
                ) : (
                  <li
                    key={link.name}
                    className="border-border flex items-center justify-between border-t py-4"
                  >
                    <span className="text-muted-foreground">{link.name}</span>
                    <Pending>{link.ph}</Pending>
                  </li>
                ),
              )}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
