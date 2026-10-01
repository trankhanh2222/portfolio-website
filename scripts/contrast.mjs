/**
 * Contrast audit for the palette. Computes WCAG 2.1 relative-luminance ratios
 * from the raw hex values so the numbers in docs/DESIGN-NOTES.md can be
 * regenerated instead of trusted.
 *
 *   node scripts/contrast.mjs
 */
const hex = (h) => {
  h = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const channel = (c) => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}
const luminance = (h) => {
  const [r, g, b] = hex(h).map(channel)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}
const level = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large' : 'FAIL')

const pairs = [
  ['light ink on paper', '#17223B', '#F7F8F4'],
  ['light ink-soft on paper', '#4A5470', '#F7F8F4'],
  ['light pencil on paper', '#6E6E64', '#F7F8F4'],
  ['light red-text on paper', '#9E2B22', '#F7F8F4'],
  ['light white on red-solid', '#FFFFFF', '#C7362A'],
  ['light ink on raised', '#17223B', '#FFFFFF'],
  ['dark ink on paper', '#E7EAF0', '#12161C'],
  ['dark ink-soft on paper', '#9AA3B2', '#12161C'],
  ['dark pencil on paper', '#7C8598', '#12161C'],
  ['dark red-text on paper', '#FF6B5A', '#12161C'],
  ['dark white on red-solid', '#FFFFFF', '#B9332A'],
  ['dark ink on raised', '#E7EAF0', '#181E26'],
]

let failures = 0
for (const [name, fg, bg] of pairs) {
  const r = ratio(fg, bg)
  const lv = level(r)
  if (lv === 'FAIL') failures += 1
  console.log(`${name.padEnd(28)} ${fg} on ${bg}  ${r.toFixed(2)}:1  ${lv}`)
}
console.log(failures === 0 ? '\nall pairs clear AA' : `\n${failures} pair(s) below AA`)
process.exit(failures === 0 ? 0 : 1)