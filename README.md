# Khánh · personal portfolio

A single-page personal site: warm editorial paper, Fraunces display type on an
off-white canvas, one clay accent. React 19 + TypeScript + Vite, hand-written CSS,
self-hosted fonts, no runtime third-party requests.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck + production build
npm run preview    # serve the built site
```

## Editing the content

Everything you need to change lives in **`src/content/site.ts`**:

- Name, role, tagline, introduction (hero).
- About paragraphs and the "currently learning" line.
- Projects: add, remove, or rewrite entries. Set `featured: true` on one project
  to get the large showcase layout.
- Interests, skill groups, journey timeline, contact links, footer note.

Links and values wrapped in square brackets (like `[GitHub URL]`) render as
honest placeholders, never as fake links. Replace the bracketed string with a
real URL and the UI automatically turns it into a working link. No component
edits needed.

## Adding images

- Portrait: drop a file at `public/images/portrait.jpg` and use it in
  `src/components/Hero.tsx` (the placeholder frame explains this on the page too).
- Project screenshots: set the `image` field of a project in `site.ts` to a path
  under `public/` (e.g. `/images/my-project.png`). While `image` is `null`, the
  showcase draws a deliberate dashed placeholder panel.

## Structure

```
src/content/site.ts   all editable content, typed
src/components/       one file per page section
src/styles.css        design tokens + all styles
src/hooks.ts          reduced-motion-aware scroll reveal
```
