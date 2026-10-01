import { contact } from '../content/site.js'
import { useCopy } from '../hooks.js'
import { ExternalIcon, Placeholder, Reveal, Section, SectionHead, SocialIcon } from './primitives.jsx'

/**
 * One link row per platform. A link with no real URL is drawn as pending, with
 * its placeholder visible: it is never a dead anchor and never a blind target.
 */
function ContactLink({ link, linkIndex }) {
  const hasLink = Boolean(link.href)

  const body = (
    <>
      <span className="link-chip__left">
        <span className="link-chip__icon">
          <SocialIcon name={link.icon} />
        </span>
        <span>
          <span className="link-chip__name">{link.name}</span>
          <span className="link-chip__value">
            {hasLink ? (
              link.handle ?? link.href
            ) : link.handlePlaceholder ? (
              <Placeholder>{link.handlePlaceholder}</Placeholder>
            ) : (
              <Placeholder>{link.placeholder}</Placeholder>
            )}
          </span>
        </span>
      </span>
      {hasLink ? (
        <span className="link-chip__icon">
          <ExternalIcon size={16} />
        </span>
      ) : (
        <span className="link-chip__pending-label">pending</span>
      )}
    </>
  )

  if (!hasLink) {
    return (
      <Reveal className="link-chip link-chip--pending" index={linkIndex}>
        {body}
      </Reveal>
    )
  }

  return (
    <Reveal as="a" className="link-chip" index={linkIndex} href={link.href} target="_blank" rel="noreferrer noopener">
      {body}
    </Reveal>
  )
}

export default function Contact() {
  const [copyState, copy] = useCopy()

  // The label reflects reality before the first click too: a disabled button
  // offering to "Copy" something that does not exist would be a lie.
  const copyLabel = !contact.email
    ? 'Not set yet'
    : {
        idle: 'Copy',
        copied: 'Copied',
        failed: 'Select it manually',
        unavailable: 'Not set yet',
      }[copyState]

  return (
    <Section id="reach" labelledBy="reach-title">
      <div className="shell">
        <SectionHead id="reach-title" label="Reach" title={contact.title} lede={contact.lede} chalk />

        <div className="reach">
          <div className="reach__links">
            {contact.links.map((link, index) => (
              <ContactLink key={link.name} link={link} linkIndex={index} />
            ))}
          </div>

          <Reveal index={1}>
            <span className="label">Email</span>
            <div className="copy-row">
              <code>
                {contact.email ?? <Placeholder>[ email address ]</Placeholder>}
              </code>
              <button
                type="button"
                className="btn btn--quiet"
                onClick={() => copy(contact.email)}
                disabled={!contact.email}
                aria-describedby="copy-feedback"
                title={contact.email ? 'Copy the address' : 'No address set yet'}
              >
                {copyLabel}
              </button>
            </div>
            <p id="copy-feedback" className="copy-feedback" role="status" aria-live="polite">
              {copyState === 'copied'
                ? 'Address copied to the clipboard.'
                : copyState === 'failed'
                  ? 'The clipboard was blocked, so select the address and copy it manually.'
                  : copyState === 'unavailable'
                    ? 'No address is set yet, so there is nothing to copy.'
                    : ''}
            </p>
            <p className="mono-note" style={{ marginTop: '0.5rem' }}>
              No email address has been added yet. Set one in{' '}
              <code>src/content/site.js</code> to enable the copy button.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}