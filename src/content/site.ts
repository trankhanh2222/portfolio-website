/**
 * Content types + placeholder helpers. The actual copy lives in
 * src/content/lang/vi.ts and src/content/lang/en.ts.
 *
 * How to make the site yours:
 *  - Edit the two lang files. Every user-visible string is there.
 *  - Anything still wrapped in square brackets (like `[GitHub URL]`) renders
 *    as an honest placeholder in the UI, never as a fake link. Placeholder
 *    URLs are detected by `isPlaceholder()` below, so you do not need to
 *    touch components.
 *  - Add or remove entries in the arrays; the layout adapts.
 *
 * Honesty rules:
 *  - No invented achievements, statistics, credentials, or testimonials.
 *  - Example text is realistic so the page looks complete, but is clearly
 *    generic and easy to swap for your own.
 */

export type Project = {
  name: string;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  githubUrl: string;
  demoUrl: string;
  /** Set to true to render the showcase large (one feature, then smaller rows). */
  featured: boolean;
  /**
   * Optional real screenshot path under /public (e.g. "/images/chess.svg").
   * While null, the UI draws a deliberate placeholder panel, not a stock image.
   */
  image: string | null;
  /** Caption shown under the placeholder/screenshot. */
  imageCaption: string;
};

export type TimelineEntry = {
  period: string;
  title: string;
  text: string;
};

export type NavItem = { label: string; href: string };

export type SiteContent = {
  docTitle: string;
  docDescription: string;
  person: {
    name: string;
    role: string;
    tagline: string;
    intro: string;
  };
  nav: NavItem[];
  about: {
    lead: string;
    body: string[];
    learning: string;
  };
  projects: Project[];
  interests: { name: string; note: string }[];
  skillGroups: { group: string; items: string[] }[];
  journey: TimelineEntry[];
  contact: {
    heading: string;
    text: string;
    email: string;
    links: { label: string; value: string }[];
  };
  footer: { note: string };
  /** Interface labels that are not editorial content. */
  ui: {
    skipToContent: string;
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    seeProjects: string;
    contactCta: string;
    backToTop: string;
    aboutTitle: string;
    projectsTitle: string;
    projectsSub: string;
    interestsTitle: string;
    skillsTitle: string;
    skillsSub: string;
    journeyTitle: string;
    journeySub: string;
    technologies: string;
    code: string;
    liveDemo: string;
    emailLabel: string;
    screenshotAlt: string;
    pendingUrlHint: string;
    pendingEmailHint: string;
    portraitPlaceholder: string;
    portraitNoteBefore: string;
    portraitNotePath: string;
    portraitNoteAfter: string;
    darkMode: string;
    lightMode: string;
    switchLanguage: string;
  };
};

/** A bracketed string like `[GitHub URL]` is treated as an unset placeholder. */
export const isPlaceholder = (value: string): boolean =>
  value.trim().startsWith("[") && value.trim().endsWith("]");
