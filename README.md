# Khanh Portfolio Website

A static personal portfolio for Khanh: C++, competitive programming, AI
experiments, and software development. Frontend only. No backend, no database,
no auth, no required API.

The design is an "algorithm notebook": faint grid paper, ink-navy text, and one
red pen used only to mark what matters. See `DESIGN.md` for the direction and
`docs/DESIGN-NOTES.md` for the measured contrast and layout values.

## Stack

- **Vite** for the dev server and build.
- **React** for the components.
- **Tailwind CSS** for the reset and utilities; most of the visual identity is
  hand-written CSS in `src/styles.css`.
- **Self-hosted fonts** (Instrument Sans for prose, IBM Plex Mono for labels and
  code). No font CDN, no third-party requests at runtime.
- **Phosphor Icons** for the interface icons.

## Getting started

```bash
npm install
npm run dev        # dev server
npm run build      # production build into dist/
npm run preview    # serve the built site on http://localhost:4173
```

The build uses `base: './'`, so `dist/` can be dropped on any static host without
further configuration.

## Tests and audits

The end-to-end suite runs against the real production build served by
`vite preview`, so what is verified is what ships.

```bash
npm run test:e2e      # Playwright: desktop + mobile projects
npm run test:a11y     # axe-core accessibility scans
```

Audit scripts (run the preview server first):

```bash
node scripts/layout-audit.mjs   # overflow, tap targets, text size across 5 viewports
node scripts/contrast.mjs       # WCAG contrast ratios for the palette
node scripts/sections.mjs       # per-section screenshots for visual review
node scripts/screenshots.mjs    # full-page screenshots, light and dark
node scripts/theme-check.mjs    # verifies the theme boots from system preference
```

## Content

All copy and data live in `src/content/`. Editing content never requires touching
layout.

- `site.js` holds the person, nav, about, projects, skills, contact links, and
  footer.
- `journal.js` holds the practice-log entries; an empty array renders an honest
  empty state.

### Honesty rules

Nothing on this site is invented. Any fact the owner has not supplied yet is
`null` or a bracketed placeholder like `[ GitHub URL ]`, and the UI renders it as
a visible placeholder rather than filling the gap with plausible-looking copy. To
activate a link or value, replace the placeholder with the real string; the UI
stops drawing it as pending automatically.

## Project layout

```
src/
  components/    section and primitive components
  content/       all copy and data
  hooks.js       IntersectionObserver / theme / clipboard hooks
  styles.css     the visual identity
scripts/         audit and screenshot tooling
tests/           Playwright specs and axe scans
docs/            measured design notes
```