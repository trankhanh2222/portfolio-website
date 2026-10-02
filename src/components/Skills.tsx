import { useReveal } from "../hooks";
import { useSite } from "../site-context";

export default function Skills() {
  const { t } = useSite();
  const reveal = useReveal<HTMLElement>();
  return (
    <section
      className="section skills"
      id="skills"
      aria-labelledby="skills-title"
      ref={reveal.ref}
    >
      <div className={"wrap " + reveal.className}>
        <h2 id="skills-title" className="section-title">
          {t.ui.skillsTitle}
        </h2>
        <p className="section-sub">{t.ui.skillsSub}</p>
        <dl className="skill-groups">
          {t.skillGroups.map((entry) => (
            <div className="skill-line" key={entry.group}>
              <dt>{entry.group}</dt>
              <dd>{entry.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
