import { projects } from '../content/site.js'
import {
  ExternalIcon,
  PenFrame,
  Placeholder,
  Reveal,
  Section,
  SectionHead,
  StatusStamp,
} from './primitives.jsx'

function ProjectLink({ link }) {
  if (link.href) {
    return (
      <a className="text-link" href={link.href} rel="noreferrer noopener" target="_blank">
        {link.label} <ExternalIcon size={14} />
      </a>
    )
  }
  return (
    <span className="mono-note">
      {link.label} <Placeholder>{link.placeholder}</Placeholder>
    </span>
  )
}

function Field({ label, value, placeholder }) {
  return (
    <div className="proof__block">
      <span className="label">{label}</span>
      <p>{value ?? <Placeholder>{placeholder}</Placeholder>}</p>
    </div>
  )
}

/**
 * Projects, laid out as annotated proof. Only one entry gets the hand-drawn pen
 * frame: the red pen marks what matters, so it does not mark everything.
 */
export default function Work() {
  return (
    <Section id="work" labelledBy="work-title">
      <div className="shell">
        <SectionHead
          id="work-title"
          label="Work"
          title="Things I have built"
          lede="One entry is real. Two are empty slots, marked as such, because a template with fake projects would defeat the point."
        />

        <div className="proof">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              className={`proof__item${project.marked ? ' proof__item--marked' : ''}`}
              index={index}
            >
              {/* The one artifact the red pen marks. The drawn line runs just
                  outside the card border, so it reads as added by hand. */}
              {project.marked ? <PenFrame /> : null}
              <div className="proof__top">
                <h3 className="proof__title">
                  {project.title ?? <Placeholder>{project.titlePlaceholder}</Placeholder>}
                </h3>
                <div className="proof__meta">
                  <StatusStamp active={project.statusActive}>{project.status}</StatusStamp>
                  <span>
                    {project.date ?? <Placeholder>{project.datePlaceholder}</Placeholder>}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span>
                    {project.role ?? <Placeholder>{project.rolePlaceholder}</Placeholder>}
                  </span>
                </div>
              </div>

              <p className="proof__body">
                {project.summary ?? <Placeholder>{project.summaryPlaceholder}</Placeholder>}
              </p>

              <Field label="Problem" value={project.problem} placeholder={project.problemPlaceholder} />
              <Field
                label="Approach"
                value={project.approach}
                placeholder={project.approachPlaceholder}
              />
              <Field
                label="How I know it works"
                value={project.verification}
                placeholder={project.verificationPlaceholder}
              />

              <div className="proof__tags">
                {project.tags.length > 0 ? (
                  project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <Placeholder>{project.tagsPlaceholder}</Placeholder>
                )}
              </div>

              <div className="proof__links">
                {project.links.map((link) => (
                  <ProjectLink key={link.label} link={link} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}