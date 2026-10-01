# DESIGN.md

Direction for Khanh's portfolio. This is the identity the site is built from. The antislop rules
(`.openclaude/skills/antislop/SKILL.md`) are applied on top as a filter.

## Owner

- Shown name: **Khanh** (the accented form "Khanh" with a diacritic is kept for the monogram only).
- Role: student.
- Domains: C++, competitive programming, AI experiments, software development.
- Audience: recruiters, peers, and the competitive-programming / AI community who land here from a
  profile link. They scan for proof of skill, not marketing.

## Design Read

> Reading this as: a student developer's personal portfolio for recruiters and peers, in an
> "algorithm notebook" visual language, dial ENERGY 2 / RHYTHM 3 / MOTION 2.

## The idea (one line)

The site is the squared notebook a competitive programmer thinks on: faint grid paper, ink-navy
text, and a single red pen used only to mark what matters.

## Why this direction fits this person

Not a generic "developer dark mode." It comes from what the work actually is: competitive
programmers solve on squared paper, draw state on grids, and annotate corrections in red. The page
borrows that object. It is specific to this owner, and it would not read the same for a different
portfolio.

## Dials (from the brief: a student portfolio, calm but not sterile)

| Dial | Value | Reason |
|---|---|---|
| ENERGY | 2 | The content is the greeting. No spectacle, but not a flat document either. |
| RHYTHM | 3 | Sections change composition on purpose (annotated proof, skill table, attempts row, lifecycle strip, contact card). No two adjacent sections share a layout family. |
| MOTION | 2 | Motion explains structure: a short offset fade-in on entry, and a red pen stroke that draws itself once when an annotation enters view. No loops, no floating, no bounce. |

## Palette

Limited to three roles plus neutrals (R-29). Every text/background pair below is verified against
WCAG AA; measured ratios are recorded in `docs/DESIGN-NOTES.md`.

Light (default), "daylight on paper":

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F7F8F4` | page canvas, faintly warm off-white |
| `--paper-2` | `#FFFFFF` | raised surfaces |
| `--ink` | `#17223B` | ink-navy body and headings |
| `--ink-soft` | `#4A5470` | secondary text, labels |
| `--grid` | `#E3E7DE` | grid lines and faint rules |
| `--rule` | `#D8DDCF` | structural borders |
| `--pencil` | `#6E6E64` | pencilled notes; dark enough to be real text at 4.5:1 |
| `--red` | `#C7362A` | the red pen: one accent, used only to mark what matters |
| `--red-text` | `#9E2B22` | red on paper backgrounds (contrast-safe text/link red) |
| `--red-solid` | `#C7362A` | the red that carries white text (buttons) |

Dark, "chalkboard / graph paper at night":

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#12161C` | canvas |
| `--paper-2` | `#181E26` | raised surfaces |
| `--ink` | `#E7EAF0` | text |
| `--ink-soft` | `#9AA3B2` | secondary text |
| `--grid` | `#1E252E` | grid lines |
| `--rule` | `#2A323C` | borders |
| `--pencil` | `#7C8598` | pencilled notes |
| `--red` | `#FF6B5A` | the red pen, lifted for dark backgrounds |
| `--red-text` | `#FF6B5A` | contrast-safe text/link red on dark |
| `--red-solid` | `#B9332A` | the red that carries white text (buttons) |

Why red and not the AI-default blue/purple: red is the teacher's mark, and in competitive
programming it is also the "wrong answer" verdict the user sees on a submission. It carries real
meaning here, so it gets to be the accent. It is used sparingly (dose: a chalk mark per section
plus a few annotation frames).

## Typography

| Family | Use | Why |
|---|---|---|
| **Instrument Sans** (variable) | display, UI, prose | Humanist and slightly geometric, with real character. Reads like careful handwriting in a technical context without being a novelty font. Not the AI-default Inter/Geist/Space Grotesk. |
| **IBM Plex Mono** | code, math notation, small labels | Designed for technical documentation. Reads as engineering, not as a "terminal costume." |

Prose measure capped near 62ch. Body line-height 1.65. Labels use mono at small size, uppercase with
moderate tracking (`0.06em`) and only where a real label is needed. The eyebrow count stays under
the R-05 / skill limit (at most one small label per three sections; the hero counts as one).

## Layout and structure

- 12-column grid with a visible quarter-inch grid behind it. The grid is the identity motif, not
  filler: content aligns to it and it fades where text must breathe.
- Radius system: `2px` for surfaces, `4px` for controls. Sharp, notebook-like. Never pill for large
  containers; the only pill is the final chalk-mark element.
- Borders are 1px, low-contrast, structural.
- Section rhythm alternates on purpose, see RHYTHM above.
- Every digression the user arrives with from a profile link is reachable in one click from the nav.

## The red pen (one accent, one motif)

The red pen is the single repeated gesture, and it behaves like a pen:

1. **Annotation frames** on 1 to 3 key artifacts (a proof step, the hero "verify" note, the now
   band). Hand-drawn look, drawn on scroll.
2. **The attempts bar**, where one submitted cell is marked in red: the page's one moment of
   tension, and a true statement about competitive programming.
3. **A chalk mark** beside a few section headings, used like a tick the teacher makes in the margin.

No other element uses red. No gradient touches the red.

## Journal (honest empty state)

Practice-log entries live in `src/content/journal.js`. Until real entries exist, the section renders
an explicit "no entries yet" state that explains what will go here and how to add one. No invented
entries, no placeholder scores. See R-27 and R-38.

## Placeholders

Every fact the owner has not supplied (links, handles, project names, dates, statuses, scores) is an
explicit placeholder written as what it is, e.g. `[ GitHub URL ]`, `[ handle ]`, `[ earned date ]`.
None are disguised as final. See `src/content/README` notes in `src/content/site.js`.

## Motion rules

- Entry: opacity 0 to 1, translateY 10px, 500 to 600ms, ease `cubic-bezier(0.16,1,0.3,1)`, stagger
  by index. Implemented with IntersectionObserver, never a scroll listener.
- The pen draw: single pass, `pathLength` animated with CSS, reset on replays only in After mode.
- Reduced motion: all of the above collapse to instant. The site is fully readable and usable with
  motion off, and with no JavaScript beyond React hydration.

## What this direction deliberately avoids

No blue-purple gradient, no glassmorphism, no floating orbits, no bento mosaic, no fake terminal
window, no cards floating on shadow, no generic CTAs, no invented statistics, no testimonials, no
"trusted by" wall, no scroll cue, no section-numbering eyebrows, no decorative status dots, no
thin-stroke icon library look, no em dashes.