import {
  ArrowUpRight,
  Code,
  DiscordLogo,
  FacebookLogo,
  GithubLogo,
  Trophy,
} from '@phosphor-icons/react'
import { useInView } from '../hooks.js'

/** Icon weight is standardized once here, so no component draws its own. */
export const ICON_WEIGHT = 'bold'

const ICONS = {
  github: GithubLogo,
  discord: DiscordLogo,
  facebook: FacebookLogo,
  contest: Trophy,
  code: Code,
}

export function SocialIcon({ name, size = 22 }) {
  const Component = ICONS[name] ?? Code
  return <Component size={size} weight={ICON_WEIGHT} aria-hidden="true" />
}

export function ExternalIcon({ size = 16 }) {
  return <ArrowUpRight size={size} weight={ICON_WEIGHT} aria-hidden="true" />
}

/**
 * Short offset fade on entry, staggered by index. Collapses to instant under
 * prefers-reduced-motion (handled in useInView and in CSS).
 */
export function Reveal({ as: Tag = 'div', index = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-inview' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--index': index, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export function Section({ id, children, className = '', tight = false, labelledBy }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`section${tight ? ' section--tight' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </section>
  )
}

/**
 * Section heading as a vertical stack (headline on top, body below). The
 * split-header pattern is deliberately not used.
 */
export function SectionHead({ id, label, title, lede, chalk = false, index = 0 }) {
  return (
    <Reveal className="section-head" index={index}>
      {label ? <span className="label">{label}</span> : null}
      <h2 id={id} className={`section-title${chalk ? ' chalk-head' : ''}`}>
        {title}
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </Reveal>
  )
}

/**
 * An explicit placeholder. It is styled to be unmistakable: an unfinished value
 * must never read as finished copy.
 */
export function Placeholder({ children }) {
  return <span className="ph">{children}</span>
}

/** Renders the real value when it exists, otherwise the placeholder. */
export function Value({ value, placeholder }) {
  if (value !== null && value !== undefined && value !== '') return value
  return <Placeholder>{placeholder}</Placeholder>
}

/** Honest self-assessment marker: ruled ticks, not a filled progress track. */
export function Ticks({ value, max = 3, label }) {
  return (
    <span className="ticks" role="img" aria-label={label}>
      {Array.from({ length: max }, (_, index) => (
        <i key={index} className={index < value ? 'on' : ''} />
      ))}
    </span>
  )
}

export function StatusStamp({ children, active = false }) {
  return <span className={`stamp${active ? ' stamp--active' : ''}`}>{children}</span>
}

/**
 * The red pen.
 *
 * `frame` draws a hand-drawn rectangle around an artifact (four strokes, with
 * the slight overshoot a real pen leaves at a corner). `skim` draws a single
 * underline. Both animate once when their parent enters view.
 *
 * These are the only hand-authored SVG paths on the page, and they are the page's
 * identity motif rather than illustrations.
 */
const FRAME_PATH =
  'M10,15 C70,10 170,12 250,13 C320,14 366,12 391,15 ' +
  'M391,15 C395,78 394,148 390,194 ' +
  'M390,194 C300,198 180,196 62,197 C44,197 22,197 10,196 ' +
  'M10,196 C7,140 8,68 10,15'

const SKIM_PATH = 'M4,12 C120,4 300,5 496,9'

export function PenFrame({ shape = 'frame', className = '' }) {
  const path = shape === 'skim' ? SKIM_PATH : FRAME_PATH
  const viewBox = shape === 'skim' ? '0 0 500 22' : '0 0 400 210'
  return (
    <span className={`pen-frame${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg viewBox={viewBox} preserveAspectRatio="none" role="presentation">
        <path d={path} pathLength="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  )
}

/**
 * The hero underline: a hand-drawn skim under one word in the headline.
 * It is the "the red pen is the accent" motif, stated once, at the top.
 */
export function PenUnderline() {
  return (
    <svg viewBox="0 0 500 24" preserveAspectRatio="none" aria-hidden="true">
      <path className="pen-stroke" d="M3,17 C130,7 300,6 497,13" pathLength="1" />
    </svg>
  )
}