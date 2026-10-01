import { about } from "../content/site";
import { useReveal } from "../hooks";

export default function About() {
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
          About
        </h2>
        <p className="about-lead">{about.lead}</p>
        {about.body.map((paragraph) => (
          <p className="about-body" key={paragraph.slice(0, 24)}>
            {paragraph}
          </p>
        ))}
        <p className="about-learning">{about.learning}</p>
      </div>
    </section>
  );
}
