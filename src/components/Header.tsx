import { useEffect, useState, type MouseEvent as ReactMouseEvent } from "react";
import { flushSync } from "react-dom";
import { useSite } from "../site-context";
import { useSmoothAnchors } from "../hooks";

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13.5A8 8 0 1 1 10.5 4a6.6 6.6 0 0 0 9.5 9.5Z" />
    </svg>
  );
}

export default function Header() {
  const { t, theme, lang, toggleTheme, toggleLang } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useSmoothAnchors();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: keep the toolbar link for the section in view highlighted.
  useEffect(() => {
    const ids = t.nav.map((item) => item.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Whichever tracked section appears first in the nav wins.
        const current = ids.find((id) => visible.has(id));
        setActive((prev) => (prev === (current ?? null) ? prev : current ?? null));
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [t.nav]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onToggleTheme = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const doc = document as ViewTransitionDoc;
    if (!doc.startViewTransition) {
      // Older browser: keep the plain cross-fade.
      document.documentElement.classList.add("theme-anim");
      toggleTheme();
      window.setTimeout(
        () => document.documentElement.classList.remove("theme-anim"),
        300,
      );
      return;
    }

    // Circle reveal spreading out from (or collapsing back to) the button.
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement;

    const next = theme === "dark" ? "light" : "dark";
    const transition = doc.startViewTransition(() => {
      // Passive effects run too late for a view transition — apply the theme
      // attribute now; the context effect just re-writes the same value.
      root.dataset.theme = next;
      flushSync(() => toggleTheme());
    });
    transition.ready.then(() => {
      // The incoming theme spreads outward from the button in a circle.
      root.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.165, 0.84, 0.44, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap header-row">
        <a className="wordmark" href="#top" onClick={() => setOpen(false)}>
          <span className="wordmark-mark" aria-hidden="true">
            K
          </span>
          {t.person.name}
        </a>

        <div className="header-controls">
          <button
            type="button"
            className="icon-button"
            onClick={onToggleTheme}
            title={theme === "dark" ? t.ui.lightMode : t.ui.darkMode}
            aria-label={theme === "dark" ? t.ui.lightMode : t.ui.darkMode}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={toggleLang}
            title={t.ui.switchLanguage}
            aria-label={t.ui.switchLanguage}
          >
            {lang === "vi" ? "EN" : "VI"}
          </button>

          <button
            type="button"
            className="menu-button"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t.ui.closeMenu : t.ui.openMenu}</span>
            <span className="menu-bar" aria-hidden="true" />
            <span className="menu-bar" aria-hidden="true" />
          </button>
        </div>

        <nav
          id="site-nav"
          className={"site-nav" + (open ? " open" : "")}
          aria-label={t.ui.mainNav}
        >
          <ul>
            {t.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={active === item.href.slice(1) ? "active" : undefined}
                  aria-current={
                    active === item.href.slice(1) ? "true" : undefined
                  }
                  onClick={() => setOpen(false)}
                >
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
