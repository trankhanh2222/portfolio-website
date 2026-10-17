import { SiteHeader } from "@/components/site/site-header"
import { Hero } from "@/components/site/hero"
import { About } from "@/components/site/about"
import { Skills } from "@/components/site/skills"
import { Experience } from "@/components/site/experience"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
