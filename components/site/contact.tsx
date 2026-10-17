"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { HyperLabel } from "@/components/ui/hyper-label"
import { Pending } from "@/components/site/pending"
import { SectionHeading } from "@/components/site/section-heading"
import { useLanguage } from "@/providers/language-provider"

const rowVariants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

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
    <section id="contact" className="scroll-mt-24 py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[210px_minmax(0,1fr)] md:gap-12">
        <BlurFade inView direction="up">
          <SectionHeading index={contact.index} title={contact.title} />
        </BlurFade>

        <div className="max-w-3xl">
          <BlurFade inView direction="up">
            <p className="text-muted-foreground max-w-xl text-pretty leading-relaxed">
              <HyperLabel text={contact.lede} className="py-0" duration={1300} />
            </p>
          </BlurFade>

          <BlurFade inView direction="up" delay={0.08}>
            <div className="mt-5 flex items-center gap-3">
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
          </BlurFade>

          <ul className="border-border mt-8 grid gap-x-12 border-b sm:grid-cols-2">
            {contact.links.map((link, i) =>
              link.href ? (
                <motion.li
                  key={link.name}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="border-border border-t"
                >
                  <a
                    href={link.href}
                    className="group border-border hover:bg-accent flex items-center justify-between border-t transition-colors"
                  >
                    <span>
                      <HyperLabel text={link.name} className="py-0" duration={700} />
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="text-muted-foreground transition-colors group-hover:text-primary size-4"
                    />
                  </a>
                </motion.li>
              ) : (
                <motion.li
                  key={link.name}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="border-border flex items-center justify-between border-t px-1 py-3"
                >
                  <span className="text-muted-foreground">
                    <HyperLabel text={link.name} className="py-0" duration={700} />
                  </span>
                  <Pending>{link.ph}</Pending>
                </motion.li>
              ),
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
