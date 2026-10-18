import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SonarField } from "@/components/site/sonar-field"
import { ScrollChoreography } from "@/components/site/scroll-choreography"
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
      {/* Full-page backdrop (tappable) + reading progress. */}
      <SonarField />
      <ScrollProgress className="bg-primary" />

      <SiteHeader />
      <ScrollChoreography />
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
