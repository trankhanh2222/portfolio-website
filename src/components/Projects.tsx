import { isPlaceholder, projects, type Project } from "../content/site";
import { useReveal } from "../hooks";

function ProjectLinks({ project }: { project: Project }) {
  const hasGithub = project.githubUrl !== "" && !isPlaceholder(project.githubUrl);
  const hasDemo = project.demoUrl !== "" && !isPlaceholder(project.demoUrl);
  return (
    <p className="project-links">
      {hasGithub ? (
        <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
          Code
        </a>
      ) : (
        <span className="pending" title="Add the real URL in src/content/site.ts">
          Code: [GitHub URL]
        </span>
      )}
      {hasDemo ? (
        <a className="text-link" href={project.demoUrl} target="_blank" rel="noreferrer">
          Live demo
        </a>
      ) : (
        <span className="pending" title="Add the real URL in src/content/site.ts">
          Demo: [Live Demo URL]
        </span>
      )}
    </p>
  );
}

function Shot({ project }: { project: Project }) {
  if (project.image !== null) {
    return (
      <figure className="shot">
        <img src={project.image} alt={`Screenshot of ${project.name}`} loading="lazy" />
      </figure>
    );
  }
  return (
    <figure className="shot shot-placeholder" role="presentation">
      <div className="shot-placeholder-inner">
        <span>{project.imageCaption}</span>
      </div>
    </figure>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const reveal = useReveal<HTMLElement>();
  return (
    <article className="project-featured" ref={reveal.ref}>
      <div className={"project-featured-grid " + reveal.className}>
        <Shot project={project} />
        <div>
          <p className="project-year">{project.year}</p>
          <h3 className="project-title">{project.name}</h3>
          <p className="project-summary">{project.summary}</p>
          <p className="project-detail">{project.detail}</p>
          <ul className="stack" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const reveal = useReveal<HTMLElement>();
  return (
    <article className="project-row" ref={reveal.ref}>
      <div className={"project-row-grid " + reveal.className}>
        <Shot project={project} />
        <div>
          <p className="project-year">{project.year}</p>
          <h3 className="project-title">{project.name}</h3>
          <p className="project-summary">{project.summary}</p>
          <ul className="stack" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <h2 id="projects-title" className="section-title">
          Projects
        </h2>
        <p className="section-sub">
          Sample entries below, in brackets until real work lands here. Each one is a slot to
          fill, not a claim.
        </p>
        {featured.map((project) => (
          <FeaturedProject key={project.name + project.year} project={project} />
        ))}
        {rest.map((project) => (
          <ProjectRow key={project.name + project.year} project={project} />
        ))}
      </div>
    </section>
  );
}
