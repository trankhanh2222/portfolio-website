import { skillGroups } from "../content/site";
import { useReveal } from "../hooks";

export default function Skills() {
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
          Tools I work with
        </h2>
        <p className="section-sub">
          A list, not a chart. Order within a group says nothing except that it reads better this way.
        </p>
        <dl className="skill-groups">
          {skillGroups.map((entry) => (
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
