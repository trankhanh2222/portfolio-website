import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveal-on-entry via IntersectionObserver.
 * Never a scroll listener: `window.addEventListener('scroll')` is banned for
 * performance and jank reasons. Under reduced motion the element is simply
 * marked visible with no transition.
 */
export function useInView({ threshold = 0.2, rootMargin = '0px 0px -6% 0px', once = true } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}

/**
 * Theme, persisted to localStorage. The inline script in index.html sets the
 * initial value before first paint so there is no flash of the wrong theme.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Storage can be blocked; the site still works, it just will not remember.
    }
  }, [theme])

  return [theme, setTheme]
}

/** True once the page has scrolled past a sentinel at the top. */
export function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel')
    if (!sentinel || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])
  return scrolled
}

/** Which section is currently in view, for the nav's active state. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])
  return active
}

/**
 * Copy to clipboard with a short-lived confirmation. Returns [state, copy].
 * No clipboard API (or a denied permission) falls back to reporting failure
 * rather than pretending it worked.
 */
export function useCopy() {
  const [state, setState] = useState('idle')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (text) => {
    if (!text) {
      setState('unavailable')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setState('copied')
    } catch {
      setState('failed')
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2200)
  }

  return [state, copy]
}

/** Escape-to-close behaviour for the mobile nav disclosure. */
export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const onKey = (event) => {
      if (event.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}