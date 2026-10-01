import { journalEntries } from '../content/journal.js'
import { journal } from '../content/site.js'
import { ExternalIcon, Reveal, Section, SectionHead } from './primitives.jsx'

/**
 * The practice log. When there are no entries it says so and explains how to
 * add one. It never invents an entry, and it never fakes a filled state with a
 * placeholder that looks like writing.
 */
export default function Journal() {
  const hasEntries = journalEntries.length > 0

  return (
    <Section id="log" labelledBy="log-title">
      <div className="shell">
        <SectionHead id="log-title" label="Log" title={journal.title} lede={journal.lede} />

        {hasEntries ? (
          <ul className="journal__list">
            {journalEntries.map((entry, index) => (
              <Reveal as="li" className="journal__entry" key={entry.date + entry.title} index={index}>
                <span className="journal__date">{entry.date}</span>
                <span className="journal__title">
                  {entry.title}
                  {entry.href ? (
                    <>
                      {' '}
                      <a
                        className="text-link"
                        href={entry.href}
                        rel="noreferrer noopener"
                        target="_blank"
                      >
                        <ExternalIcon size={14} />
                      </a>
                    </>
                  ) : null}
                </span>
                <p className="journal__summary">{entry.summary}</p>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal className="empty-state" index={0}>
            <p className="empty-state__title">No entries yet.</p>
            <p>
              This is where short notes go: the problem, the wrong answer, and what changed. They
              are not written yet, and inventing them would make the page pointless.
            </p>
            <p className="mono-note" style={{ marginTop: '0.75rem' }}>
              Add one in <code>src/content/journal.js</code>. The list renders itself.
            </p>
          </Reveal>
        )}
      </div>
    </Section>
  )
}