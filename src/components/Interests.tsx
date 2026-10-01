import { interests } from "../content/site";
import { useReveal } from "../hooks";

export default function Interests() {
  const reveal = useReveal<HTMLElement>();
  return (
    <section
      className="section interests"
      id="interests"
      aria-labelledby="interests-title"
      ref={reveal.ref}
    >
      <div className={"wrap wrap-narrow " + reveal.className}>
        <h2 id="interests-title" className="section-title section-title-inline">
          Things I spend time on
        </h2>
        <ul className="interest-list">
          {interests.map((item) => (
            <li key={item.name}>
              <span className="interest-name">{item.name}</span>
              <span className="interest-note">{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
