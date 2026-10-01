import { person } from "../content/site";

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <p className="hero-role">{person.role}</p>
          <h1 id="hero-title" className="hero-name">
            {person.name}
          </h1>
          <p className="hero-tagline">{person.tagline}</p>
          <p className="hero-intro">{person.intro}</p>
          <p className="hero-actions">
            <a className="btn btn-solid" href="#projects">
              See the projects
            </a>
            <a className="btn btn-quiet" href="#contact">
              Contact
            </a>
          </p>
        </div>

        <div className="hero-portrait" aria-hidden="true">
          <div className="portrait-frame">
            <div className="portrait-placeholder">
              <span>[Your portrait]</span>
            </div>
          </div>
          <p className="portrait-note">
            Drop a photo at <code>public/images/portrait.jpg</code> and point the
            Hero component at it. Until then this frame stays honest.
          </p>
        </div>
      </div>
    </section>
  );
}
