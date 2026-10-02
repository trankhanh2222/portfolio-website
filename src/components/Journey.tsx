import { useReveal } from "../hooks";
import { useSite } from "../site-context";

export default function Journey() {
  const { t } = useSite();
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
          {t.ui.journeyTitle}
        </h2>
        <p className="section-sub">{t.ui.journeySub}</p>
        <ol className="timeline">
          {t.journey.map((entry) => (
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
