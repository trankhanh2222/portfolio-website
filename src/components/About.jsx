import { about, cycle } from '../content/site.js'
import { Reveal, Section, SectionHead } from './primitives.jsx'

/**
 * About prose plus the lifecycle strip. The strip is a horizontal scale, a
 * different layout family from the prose above it and the project cards below
 * it, so no two adjacent sections repeat a skeleton.
 */
export default function About() {
  return (
    <Section id="about" labelledBy="about-title" className="ruled">
      <div className="shell">
        <SectionHead
          id="about-title"
          label="About"
          title="I learn by getting it wrong first"
          lede="Most of what I know came from a wrong answer that told me exactly which assumption was broken."
          chalk
        />

        <div className="about-grid">
          <Reveal className="prose" index={0}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} style={{ marginBottom: '1rem' }}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <div>
            <Reveal index={1}>
              <span className="label">How a problem usually goes</span>
              <p className="mono-note" style={{ marginTop: '0.5rem' }}>
                {cycle.note}
              </p>
            </Reveal>
            <Reveal className="cycle" index={2}>
              {cycle.steps.map((step, index) => (
                <div
                  key={step.name}
                  className={`cycle__step${step.accent ? ' cycle__step--accent' : ''}`}
                >
                  <span className="cycle__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="cycle__name">{step.name}</span>
                  <p className="cycle__detail">{step.detail}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}