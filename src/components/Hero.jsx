import { person } from '../content/site.js'
import { PenUnderline, Reveal } from './primitives.jsx'
import GridSketch from './GridSketch.jsx'

/**
 * Hero as asymmetric editorial: the headline and the artifact are one composition,
 * not a centered pile. The headline carries the name and the domains in ordinary
 * words, and the red pen underlines the one word that matters.
 */
export default function Hero() {
  return (
    <section id="top" className="grid-paper" aria-labelledby="hero-title">
      <div className="shell hero">
        <div className="hero__grid">
          <div>
            <Reveal className="hero__eyebrow-line" index={0}>
              <span className="rule" aria-hidden="true" />
              <span className="label">{person.eyebrow}</span>
            </Reveal>

            <Reveal index={1}>
              <h1 id="hero-title" className="hero__title">
                {person.name} studies{' '}
                <span className="pen">
                  {person.heroUnderline}
                  <PenUnderline />
                </span>
                <br />
                and builds small things.
              </h1>
            </Reveal>

            <Reveal index={2}>
              <p className="lede hero__lede">{person.lede}</p>
            </Reveal>

            <Reveal className="hero__actions" index={3}>
              <a className="btn btn--primary" href="#work">
                Read the work
              </a>
              <a className="btn btn--quiet" href="#reach">
                Reach out
              </a>
            </Reveal>
          </div>

          <Reveal className="sketch" index={2}>
            <div className="sketch__head">
              <span className="label">Notebook, first pass</span>
            </div>
            <GridSketch />
            <p className="sketch__caption">
              The grid graph from the hero sketch, with one route marked in red. Drawn before the
              code, not after it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}