import { isPlaceholder } from "../content/site";
import { useReveal } from "../hooks";
import { useSite } from "../site-context";

export default function Contact() {
  const { t } = useSite();
  const reveal = useReveal<HTMLElement>();
  const hasEmail = t.contact.email !== "" && !isPlaceholder(t.contact.email);
  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
      ref={reveal.ref}
    >
      <div className={"wrap wrap-narrow " + reveal.className}>
        <h2 id="contact-title" className="contact-heading">
          {t.contact.heading}
        </h2>
        <p className="contact-text">{t.contact.text}</p>
        <ul className="contact-links">
          <li>
            {hasEmail ? (
              <a className="text-link" href={`mailto:${t.contact.email}`}>
                {t.ui.emailLabel}
              </a>
            ) : (
              <span className="pending" title={t.ui.pendingEmailHint}>
                {t.ui.emailLabel}: {t.contact.email}
              </span>
            )}
          </li>
          {t.contact.links.map((link) => {
            const set = link.value !== "" && !isPlaceholder(link.value);
            return (
              <li key={link.label}>
                {set ? (
                  <a className="text-link" href={link.value} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <span className="pending" title={t.ui.pendingUrlHint}>
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
