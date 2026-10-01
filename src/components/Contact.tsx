import { contact, isPlaceholder } from "../content/site";
import { useReveal } from "../hooks";

export default function Contact() {
  const reveal = useReveal<HTMLElement>();
  const hasEmail = contact.email !== "" && !isPlaceholder(contact.email);
  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
      ref={reveal.ref}
    >
      <div className={"wrap wrap-narrow " + reveal.className}>
        <h2 id="contact-title" className="contact-heading">
          {contact.heading}
        </h2>
        <p className="contact-text">{contact.text}</p>
        <ul className="contact-links">
          <li>
            {hasEmail ? (
              <a className="text-link" href={`mailto:${contact.email}`}>
                Email
              </a>
            ) : (
              <span className="pending" title="Add your real email in src/content/site.ts">
                Email: {contact.email}
              </span>
            )}
          </li>
          {contact.links.map((link) => {
            const set = link.value !== "" && !isPlaceholder(link.value);
            return (
              <li key={link.label}>
                {set ? (
                  <a className="text-link" href={link.value} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <span className="pending" title="Add the real URL in src/content/site.ts">
                    {link.label}: {link.value}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
