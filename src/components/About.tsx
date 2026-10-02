import { useReveal } from "../hooks";
import { useSite } from "../site-context";

export default function About() {
  const { t } = useSite();
  const reveal = useReveal<HTMLElement>();
  return (
    <section
      className="section about"
      id="about"
      aria-labelledby="about-title"
      ref={reveal.ref}
    >
      <div className={"wrap " + reveal.className}>
        <h2 id="about-title" className="section-title">
          {t.ui.aboutTitle}
        </h2>
        <p className="about-lead">{t.about.lead}</p>
        {t.about.body.map((paragraph) => (
          <p className="about-body" key={paragraph.slice(0, 24)}>
            {paragraph}
          </p>
        ))}
        <p className="about-learning">{t.about.learning}</p>
      </div>
    </section>
  );
}
