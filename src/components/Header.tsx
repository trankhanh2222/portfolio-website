import { useEffect, useState } from "react";
import { nav, person } from "../content/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap header-row">
        <a className="wordmark" href="#top" onClick={() => setOpen(false)}>
          <span className="wordmark-mark" aria-hidden="true">
            K
          </span>
          {person.name}
        </a>

        <button
          type="button"
          className="menu-button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="menu-bar" aria-hidden="true" />
          <span className="menu-bar" aria-hidden="true" />
        </button>

        <nav
          id="site-nav"
          className={"site-nav" + (open ? " open" : "")}
          aria-label="Main"
        >
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
