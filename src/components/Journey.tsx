import { journey } from "../content/site";
import { useReveal } from "../hooks";

export default function Journey() {
  const reveal = useReveal<HTMLElement>();
  return (
    <section
      className="section journey"
      id="journey"
      aria-labelledby="journey-title"
      ref={reveal.ref}
    >
      <div className={"wrap wrap-narrow " + reveal.className}>
        <h2 id="journey-title" className="section-title">
          The journey so far
        </h2>
        <p className="section-sub">Example milestones. Every date and event here is yours to overwrite.</p>
        <ol className="timeline">
          {journey.map((entry) => (
            <li key={entry.period + entry.title}>
              <p className="timeline-period">{entry.period}</p>
              <h3 className="timeline-title">{entry.title}</h3>
              <p className="timeline-text">{entry.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
