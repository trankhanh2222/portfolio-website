# Khanh — Portfolio

Personal portfolio for **Khanh**: student developer — C++, competitive programming, small software, and AI experiments.

One static page, two languages (EN/VI), dark-first with a signal-orange identity.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (radix preset) — Button, Badge, Separator
- **motion** (Framer Motion) for reveals, **next-themes** for the dark/light switch
- Self-hosted fonts via Fontsource: Sora Variable (sans) + IBM Plex Mono (mono)
- **Playwright** for smoke tests

## Signature pieces

| Piece | What it does |
| --- | --- |
| `components/ui/sonar-grid.tsx` | Canvas dot field rendered as a **fixed full-page backdrop** (`components/site/sonar-field.tsx`). No ambient waves — the only way one appears is a tap anywhere (the layer listens on `window`, so text and buttons still receive events). Theme-aware, pauses in hidden tabs, respects `prefers-reduced-motion`. Vendored from [21st.dev](https://21st.dev); adapted: `listenOn` prop for the window-tap mode. |
| `components/ui/kinetic-navigation.tsx` | **Kinetic fullscreen navigation** (GSAP + CustomEase, ported from the Sterling Gate pattern): one hamburger trigger (three bars morph into an ✕, middle bar pinches on hover) opens a **full-viewport** two-column menu — three skewed backdrop layers sweep right→left with stagger, numbered links rise spinning, and hovering a link lands a **solid signal-orange band** whose text flips to the orange-surface ink while crisp ink geometry pops in at the row's right end. A right-hand meta column (`menu`/`contact`/`footer` content) fills the desktop void and stacks under the links under 900px, so nothing stares back empty. The bar carries logo + language/theme controls only. Escape closes, body scroll locks, focus moves into the panel (and back) for keyboard users; reduced motion plays everything nearly instantly. Close mirrors the open choreography, and stays visible because the GSAP context is killed (never `revert()`), preserving inline state between runs. Static class styles live in `globals.css` under "Kinetic navigation". |
| `components/ui/hyper-label.tsx` | Magic UI's **HyperText** driven by a value: labels render plain on first paint, then scramble into the new text exactly once **at the moment the locale changes** (`key`-remount, forced `startOnView=false`) — off-screen labels scramble silently and are settled before you scroll there. Applied to every string the site renders: nav labels, section headings, hero copy, paragraphs, skill rows, experience items, contact rows and pending placeholders (cascaded `delay` per index). Body copy settles in the original case (`preserveCase`) — CSS `text-transform` handles display caps. Reduced motion swaps instantly. |
| `components/ui/shutter-glyph-footer.tsx` | Signal-orange footer with the name drawn as a giant SVG display alphabet (no font — pure geometry). One letter is swapped for a "shutter" whose three blades track your pointer; letters flip on click and scramble on hover. Adapted from the same source: the newsletter signup was removed and the first column now carries a contact CTA; links without an `href` render as honest pending placeholders. (The display alphabet covers A–Z only, so the wordmark is spelled without diacritics.) |
| `components/ui/scroll-progress.tsx` | Magic UI reading-progress bar pinned to the top edge, recolored to the signal orange. |

## Animation ladder (basic → advanced)

- **Kinetic nav choreography** — GSAP timelines (`CustomEase` 0.65/0.01/0.05/0.99): full-viewport wipe of three skewed backdrop layers, numbered menu links rise spinning (yPercent 140 + rotate 10°), the hamburger morphs into an ✕ (and pinches on hover); hovering a link summons its abstract shape (`back.out(1.7)`).
- **Hero enter** — staggered rise + blur (`motion`), skipped under reduced motion.
- **BlurFade reveals** — every section block fades up with a blur dissolve; paragraphs stagger by index.
- **Rows stagger** — skill rows and contact links slide in one after another; the skill **tier meter** pops cell by cell.
- **HyperText headings** — section titles scramble into place when they first scroll into view (and on every locale change).
- **Scroll-linked timeline** — the Experience rail's progress line is driven by `useScroll` + `useSpring`, scaled to how far you've scrolled through the list.
- **View Transitions** — the theme toggle uses the Magic UI `animated-theme-toggler` circle wipe.

## Runs like this

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the build
npm run lint
npx playwright test
```

## Content lives in one file: `content/site.ts`

Everything the page says (both languages) is data in `content/site.ts`, typed so the
Vietnamese object must match the English one key-for-key (`const vi: Content`).

### The honesty rule

Nothing is invented. Facts the owner has not supplied are `null` in the data,
paired with an explicit placeholder string (`ph`), and the UI renders a visible
pending token instead of fake copy:

```ts
email: null,          emailPh: "[ email address ]",
links: [{ name: "GitHub", href: null, ph: "[ GitHub URL ]" }, …]
```

To make the site "real", replace the `null`s in `content/site.ts`:

- `contact.email` → enables the copy-to-clipboard row
- `contact.links[*].href` → turns pending rows into real links (same for `footer.socials`, `footer.legal`)
- `about.facts[*].value` → location / status lines
- `experience.items[*]` → real timeline rows (a `[ empty slot ]` chip disappears automatically)
- `meta.title` / `meta.description` → page metadata

Language choice persists in `localStorage` (`portfolio-locale`); the theme in
`localStorage` via next-themes (`theme`). Server-rendered defaults are EN + dark.

## Structure

```
app/                    layout (providers, fonts, metadata), page, globals.css (tokens), icon.svg
components/site/        Header, Hero, About, Skills, Experience, Contact, SiteFooter + primitives
components/ui/          shadcn primitives + sonar-grid, shutter-glyph-footer, kinetic-navigation (GSAP), hyper-text/hyper-label, blur-fade, scroll-progress, theme toggler
content/site.ts         all EN/VI copy and data (single source of truth)
providers/              theme-provider (next-themes), language-provider (locale + `t`)
tests/smoke.spec.ts     Playwright smoke suite (structure, language, theme, keyboard)
```

## Implementation notes (Next 16 specific)

- **Cache Components is enabled**, so `new Date()` cannot run during prerender —
  the footer resolves the copyright year in a `useEffect` instead.
- `LayoutProps<"/">` is used for the root layout typing.
- The theme toggler is used in **controlled mode** and only passes `theme`
  after hydration (via a `mounted` gate): the server renders the uncontrolled
  default; passing `resolvedTheme` during hydration would flip the icon and
  raise a React #418 hydration error.
- Language restore also happens in a mount effect (same pattern as
  next-themes): the EN default renders first, the stored VI choice applies
  right after mount — and the HyperText scramble makes the correction
  read as a deliberate transition, not a flash.
