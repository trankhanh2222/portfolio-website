# Design notes

Measured values behind the claims in `DESIGN.md`. Ratios are WCAG 2.1 relative
luminance contrast ratios, computed from the raw hex values, not eyeballed.

## Contrast (measured)

Regenerate with `node scripts/contrast.mjs`.

### Light ("daylight on paper")

| Pair | Foreground | Background | Ratio | Level |
|---|---|---|---|---|
| Body and headings | `#17223B` | `#F7F8F4` | 14.82:1 | AAA |
| Secondary text | `#4A5470` | `#F7F8F4` | 7.05:1 | AAA |
| Pencilled notes | `#6E6E64` | `#F7F8F4` | 4.83:1 | AA |
| Red text and links | `#9E2B22` | `#F7F8F4` | 6.98:1 | AA |
| White on a red button | `#FFFFFF` | `#C7362A` | 5.26:1 | AA |
| Body on raised surface | `#17223B` | `#FFFFFF` | 15.81:1 | AAA |

### Dark ("chalkboard")

| Pair | Foreground | Background | Ratio | Level |
|---|---|---|---|---|
| Body and headings | `#E7EAF0` | `#12161C` | 15.06:1 | AAA |
| Secondary text | `#9AA3B2` | `#12161C` | 7.13:1 | AAA |
| Pencilled notes | `#7C8598` | `#12161C` | 4.90:1 | AA |
| Red text and links | `#FF6B5A` | `#12161C` | 6.48:1 | AA |
| White on a red button | `#FFFFFF` | `#B9332A` | 5.88:1 | AA |
| Body on raised surface | `#E7EAF0` | `#181E26` | 13.91:1 | AAA |

Every text pair clears AA at normal size. The two closest to the line are
`--pencil` in both themes (4.83:1 and 4.90:1); both are used only at 12px or
above with uppercase/letter-spaced labels, never at small body size.

## Smallest type in use

Nothing renders below 12px. The mono micro-labels (monogram, section labels,
stamps, skill tags, cycle indices) were raised to a 12px floor during the
layout audit, and the placeholder token uses `font-size: max(0.85em, 12px)`
so it stays legible inside small metadata while still scaling in prose.

## Tap targets

Checked at 1440, 1024, 768, 390 and 320px by `scripts/layout-audit.mjs`.
No interactive element falls below 24px in either dimension, and no viewport
has horizontal overflow.

## Motion

Entry reveals and the single pen stroke are `IntersectionObserver` driven, never
scroll listeners. All of it collapses to instant under
`prefers-reduced-motion: reduce`; the end-to-end suite asserts nothing is left
invisible when motion is off.