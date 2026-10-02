import { useSite } from "../site-context";

export default function Hero() {
  const { t } = useSite();
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="hero-role hero-rise hero-rise-1">{t.person.role}</p>
          <h1 id="hero-title" className="hero-name hero-rise hero-rise-2">
            {t.person.name}
          </h1>
          <p className="hero-tagline hero-rise hero-rise-3">{t.person.tagline}</p>
          <p className="hero-intro hero-rise hero-rise-4">{t.person.intro}</p>
          <p className="hero-actions hero-rise hero-rise-5">
            <a className="btn btn-solid" href="#projects">
              {t.ui.seeProjects}
            </a>
            <a className="btn btn-quiet" href="#contact">
              {t.ui.contactCta}
            </a>
          </p>
        </div>

        <div className="hero-portrait" aria-hidden="true">
          <div className="portrait-frame">
            <div className="portrait-placeholder">
              <span>{t.ui.portraitPlaceholder}</span>
            </div>
          </div>
          <p className="portrait-note">
            {t.ui.portraitNoteBefore}
            <code>{t.ui.portraitNotePath}</code> {t.ui.portraitNoteAfter}
          </p>
        </div>
      </div>
    </section>
  );
}
