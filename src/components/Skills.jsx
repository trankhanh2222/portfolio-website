import { attempts, now, skills } from '../content/site.js'
import { Reveal, Section, SectionHead, Ticks, Placeholder } from './primitives.jsx'

/**
 * Skills as a bench: rows with rules, not a card grid and not progress bars.
 * The level is a labeled self-assessment, and one row of ruled ticks reads as a
 * measurement without pretending to be one.
 */
export default function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title">
      <div className="shell">
        <SectionHead
          id="skills-title"
          label="Skills"
          title="What I work with"
          lede={skills.note}
          chalk
        />

        <Reveal className="bench" index={0}>
          {skills.rows.map((row) => {
            const tier = skills.tiers[row.tier]
            return (
              <div className="bench__row" key={row.name}>
                <span className="bench__name">{row.name}</span>
                <p className="bench__detail">{row.detail}</p>
                <span className="bench__level">
                  <Ticks
                    value={tier.ticks}
                    label={`${row.name}: ${tier.label}, ${tier.ticks} of 3`}
                  />
                </span>
              </div>
            )
          })}
        </Reveal>

        <Reveal className="attempts" index={1} style={{ marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
          <div className="attempts__bar" aria-hidden="true">
            {attempts.cells.map((wrong, index) => (
              <span
                key={index}
                className={`attempts__cell${wrong ? ' attempts__cell--wa' : ''}`}
              />
            ))}
          </div>
          <div className="attempts__legend">
            <span>
              <span className="attempts__key" aria-hidden="true" />
              Accepted
            </span>
            <span>
              <span className="attempts__key attempts__key--wa" aria-hidden="true" />
              Wrong answer
            </span>
          </div>
          <div style={{ maxWidth: '38ch' }}>
            <p className="prose" style={{ color: 'var(--ink)' }}>
              {attempts.caption}
            </p>
            <p className="mono-note" style={{ marginTop: '0.4rem' }}>
              {attempts.note}
            </p>
          </div>
        </Reveal>

        <Reveal className="now-band" index={2}>
          <span className="label">Now</span>
          <p className="now-band__text">{now.text}</p>
          <a className="text-link" href={now.link.href}>
            {now.link.label}
          </a>
        </Reveal>

        <Reveal index={3} style={{ marginTop: '1.5rem' }}>
          <span className="mono-note">
            Not listed yet: <Placeholder>{skills.morePlaceholder}</Placeholder>
          </span>
        </Reveal>
      </div>
    </Section>
  )
}