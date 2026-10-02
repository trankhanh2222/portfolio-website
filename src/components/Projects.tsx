import { isPlaceholder, type Project } from "../content/site";
import { useReveal } from "../hooks";
import { useSite } from "../site-context";

function ProjectLinks({ project }: { project: Project }) {
  const { t } = useSite();
  const hasGithub = project.githubUrl !== "" && !isPlaceholder(project.githubUrl);
  const hasDemo = project.demoUrl !== "" && !isPlaceholder(project.demoUrl);
  return (
    <p className="project-links">
      {hasGithub ? (
        <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
          {t.ui.code}
        </a>
      ) : (
        <span className="pending" title={t.ui.pendingUrlHint}>
          {t.ui.code}: {project.githubUrl || "[GitHub URL]"}
        </span>
      )}
      {hasDemo ? (
        <a className="text-link" href={project.demoUrl} target="_blank" rel="noreferrer">
          {t.ui.liveDemo}
        </a>
      ) : (
        project.demoUrl !== "" && (
          <span className="pending" title={t.ui.pendingUrlHint}>
            {t.ui.liveDemo}: {project.demoUrl}
          </span>
        )
      )}
    </p>
  );
}

function Shot({ project }: { project: Project }) {
  const { t } = useSite();
  if (project.image !== null) {
    return (
      <figure className="shot">
        <img
          src={project.image}
          alt={t.ui.screenshotAlt.replace("{name}", project.name)}
          loading="lazy"
        />
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

function FeaturedProject({ project, delay }: { project: Project; delay: number }) {
  const { t } = useSite();
  const reveal = useReveal<HTMLElement>(delay);
  return (
    <article className="project-featured" ref={reveal.ref}>
      <div className={"project-featured-grid " + reveal.className} style={reveal.style}>
        <Shot project={project} />
        <div>
          <p className="project-year">{project.year}</p>
          <h3 className="project-title">{project.name}</h3>
          <p className="project-summary">{project.summary}</p>
          <p className="project-detail">{project.detail}</p>
          <ul className="stack" aria-label={t.ui.technologies}>
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

function ProjectRow({ project, delay }: { project: Project; delay: number }) {
  const { t } = useSite();
  const reveal = useReveal<HTMLElement>(delay);
  return (
    <article className="project-row" ref={reveal.ref}>
      <div className={"project-row-grid " + reveal.className} style={reveal.style}>
        <Shot project={project} />
        <div>
          <p className="project-year">{project.year}</p>
          <h3 className="project-title">{project.name}</h3>
          <p className="project-summary">{project.summary}</p>
          <ul className="stack" aria-label={t.ui.technologies}>
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
  const { t } = useSite();
  const header = useReveal<HTMLDivElement>();
  const featured = t.projects.filter((p) => p.featured);
  const rest = t.projects.filter((p) => !p.featured);
  return (
    <section className="section projects" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div ref={header.ref} className={header.className}>
          <h2 id="projects-title" className="section-title">
            {t.ui.projectsTitle}
          </h2>
          <p className="section-sub">{t.ui.projectsSub}</p>
        </div>
        {featured.map((project, i) => (
          <FeaturedProject key={project.name + project.year} project={project} delay={i * 90} />
        ))}
        {rest.map((project, i) => (
          <ProjectRow key={project.name + project.year} project={project} delay={i * 90} />
        ))}
      </div>
    </section>
  );
}
