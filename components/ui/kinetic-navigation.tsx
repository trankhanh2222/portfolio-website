"use client"

import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { Magnetic } from "@/components/ui/magnetic"

/**
 * KineticNavigation — Sterling-Gate-style header + fullscreen overlay menu,
 * adapted for the signal-deck system.
 *
 * Structure/class-name contract (and the open/close choreography) follows the
 * upstream component: `.nav-overlay-wrapper`/.menu-content/.backdrop-layer/
 * .nav-link/.nav-close-btn/.bg-shape-*, all animated with GSAP + CustomEase.
 *
 * Port adjustments:
 * - Content comes in via props (logo, localized links, small header controls).
 * - Links navigate to in-page anchors and close the menu on click.
 * - Focus moves to the first link on open, back to the menu button on close;
 *   body scroll locks while open; Escape closes.
 * - Everything collapses to ~instant durations under prefers-reduced-motion.
 * - Abstract shapes are recolored to the signal-orange palette.
 */

export interface KineticNavLink {
  href: string
  /** Rendered inside the menu link; may include animated labels. */
  label: React.ReactNode
}

export interface KineticNavigationProps {
  /** Rendered first inside the bar (startup skip link). */
  preNav?: React.ReactNode
  /** Brand inside the left logo anchor. */
  logo: React.ReactNode
  logoHref?: string
  links: KineticNavLink[]
  /** Small controls (language/theme) to the left of the menu button. */
  controls?: React.ReactNode
  /**
   * Secondary column of the fullscreen menu (contact shortcuts, credit) —
   * fills the right half on wide screens and stacks under the links below
   * the breakpoint. Animated with the same data-menu-fade ladder.
   */
  meta?: React.ReactNode
  /** Accessibility label of the menu trigger (aria-label + aria-pressed pair). */
  openLabel: string
  closeLabel: string
  className?: string
}

// CustomEase ships free with gsap ≥ 3.13; registration is browser-only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase)
}

// Ink geometry anchored to the right end of a hovered row. Three
// compositions cycle across the rows; fills are the same near-black ink
// that sits on orange surfaces, so they read on the solid hover band in
// either theme.
const SHAPES = 3

function RowShapes({ variant }: { variant: number }) {
  return (
    <svg
      className={`row-shapes row-shapes-${variant}`}
      viewBox="0 0 240 72"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      {variant === 0 ? (
        <>
          <polygon className="shape-element" points="116,72 240,8 240,72" fill="rgba(12,12,12,0.9)" />
          <polygon className="shape-element" points="30,24 42,36 30,48 18,36" fill="rgba(12,12,12,0.32)" />
        </>
      ) : variant === 1 ? (
        <>
          <polygon className="shape-element" points="148,72 186,6 216,6 178,72" fill="rgba(12,12,12,0.88)" />
          <polygon className="shape-element" points="204,72 232,20 240,20 240,72" fill="rgba(12,12,12,0.3)" />
        </>
      ) : (
        <>
          <polygon className="shape-element" points="178,72 205,4 224,72" fill="rgba(12,12,12,0.9)" />
          <polygon className="shape-element" points="232,72 240,34 240,72" fill="rgba(12,12,12,0.34)" />
          <polygon className="shape-element" points="26,30 74,30 74,38 26,38" fill="rgba(12,12,12,0.26)" />
        </>
      )}
    </svg>
  )
}

export function KineticNavigation({
  preNav,
  logo,
  logoHref = "#top",
  links,
  controls,
  meta,
  openLabel,
  closeLabel,
  className,
}: KineticNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const wasOpenRef = useRef(false)

  // Custom easing for the whole component + hover-reactive abstract shapes.
  useEffect(() => {
    if (!containerRef.current) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const d = (seconds: number) => (reduce ? 0.01 : seconds)

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99")
        gsap.defaults({ ease: "main", duration: 0.7 })
      }
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e)
      gsap.defaults({ ease: "power2.out", duration: 0.7 })
    }

    const cleanups: Array<() => void> = []

    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      // Hover-reactive ink geometry lives INSIDE each menu row (right end) —
      // one composition cycles across rows instead of scattered blobs.
      const menuItems = container.querySelectorAll(".menu-list-item")

      menuItems.forEach((item) => {
        const shapeEls = item.querySelectorAll(".shape-element")

        const onEnter = () => {
          gsap.fromTo(
            shapeEls,
            { scale: 0.55, opacity: 0, rotation: -8, transformOrigin: "72% 85%" },
            { scale: 1, opacity: 1, rotation: 0, duration: d(0.55), stagger: d(0.07), ease: "back.out(1.7)", overwrite: "auto" },
          )
        }
        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: d(0.28),
            ease: "power2.in",
            overwrite: "auto",
          })
        }

        item.addEventListener("mouseenter", onEnter)
        item.addEventListener("mouseleave", onLeave)
        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter)
          item.removeEventListener("mouseleave", onLeave)
        })
      })

      // Hamburger hover: the middle bar pinches and springs back.
      const menuButton = container.querySelector(".nav-close-btn")
      const middleBar = menuButton?.querySelector(".menu-bar:nth-child(2)")
      if (menuButton && middleBar) {
        const onBtnEnter = () => {
          gsap.to(middleBar, { scaleX: 0.55, transformOrigin: "left center", duration: d(0.3), ease: "power2.out", overwrite: "auto" })
        }
        const onBtnLeave = () => {
          gsap.to(middleBar, { scaleX: 1, duration: d(0.45), ease: "power3.out", overwrite: "auto" })
        }
        menuButton.addEventListener("mouseenter", onBtnEnter)
        menuButton.addEventListener("mouseleave", onBtnLeave)
        cleanups.push(() => {
          menuButton.removeEventListener("mouseenter", onBtnEnter)
          menuButton.removeEventListener("mouseleave", onBtnLeave)
        })
      }
    }, containerRef)

    return () => {
      ctx.revert()
      cleanups.forEach((fn) => fn())
    }
  }, [])

  // Open/close choreography for the fullscreen menu.
  useEffect(() => {
    if (isMenuOpen) wasOpenRef.current = true
    if (!containerRef.current) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const d = (seconds: number) => (reduce ? 0.01 : seconds)

    const ctx = gsap.context(() => {
      const container = containerRef.current
      if (!container) return

      const navWrap = container.querySelector(".nav-overlay-wrapper")
      const menu = container.querySelector(".menu-content")
      const overlay = container.querySelector(".overlay")
      const bgPanels = container.querySelectorAll(".backdrop-layer")
      const menuLinks = container.querySelectorAll(".nav-link")
      const fadeTargets = container.querySelectorAll("[data-menu-fade]")
      const menuButton = container.querySelector(".nav-close-btn")
      const bars = menuButton ? Array.from(menuButton.querySelectorAll<HTMLElement>(".menu-bar")) : []
      const [topBar = null, midBar = null, bottomBar = null] = bars
      if (!navWrap || !menu) return

      const tl = gsap.timeline()
      if (isMenuOpen) {
        navWrap.setAttribute("data-nav", "open")
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          // Reset any shape left mid-flight by a fast close, so a reopened
          // menu starts clean.
          .set(container.querySelectorAll(".row-shapes .shape-element"), { opacity: 0 }, "<")
          // Hamburger morphs into an ✕, bar by bar.
          .fromTo(topBar ?? [], { y: 0, rotate: 0 }, { y: 6.5, rotate: 45, duration: d(0.45), ease: "back.out(1.6)" }, "<")
          .fromTo(bottomBar ?? [], { y: 0, rotate: 0 }, { y: -6.5, rotate: -45, duration: d(0.45), ease: "back.out(1.6)" }, "<0.06")
          .to(midBar ?? [], { opacity: 0, scaleX: 0.2, duration: d(0.3), ease: "power2.in" }, "<")
          // Full-screen wipe: three panels peel right→left with a slight skew
          // and a shallow hinge (rotateY about their right edge) that reads as
          // depth while they swing in.
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: d(0.3) }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101, skewX: -6, rotateY: -12, transformPerspective: 1200, transformOrigin: "right center" },
            { xPercent: 0, skewX: 0, rotateY: 0, stagger: d(0.12), duration: d(0.6) },
            "<",
          )
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: d(0.07), duration: d(0.6) },
            "<+=0.35",
          )

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: d(0.04), clearProps: "all" },
            "<+=0.2",
          )
        }

        // Keyboard: land inside the panel once it has opened.
        tl.call(() => {
          container.querySelector<HTMLElement>(".nav-link")?.focus()
        })
      } else {
        navWrap.setAttribute("data-nav", "closed")
        // Mirror of the open choreography. Guarded by wasOpenRef: the initial
        // closed-mount run has no inline state to animate at all.
        if (wasOpenRef.current) {
          wasOpenRef.current = false
          tl.to(fadeTargets, { autoAlpha: 0, duration: d(0.2), ease: "power1.in" }, 0)
            .to(
              menuLinks,
              { yPercent: 140, rotate: -8, stagger: { each: d(0.045), from: "end" }, duration: d(0.4), ease: "power2.in" },
              0,
            )
            .to(
              bgPanels,
              { xPercent: 101, skewX: -6, rotateY: -12, transformPerspective: 1200, transformOrigin: "right center", stagger: { each: d(0.1), from: "end" }, duration: d(0.55), ease: "power2.in" },
              d(0.12),
            )
            .to(overlay, { autoAlpha: 0, duration: d(0.25) }, d(0.4))
          if (topBar) {
            tl.to(topBar, { y: 0, rotate: 0, duration: d(0.4), ease: "power2.out" }, d(0.05))
              .to(bottomBar ?? [], { y: 0, rotate: 0, duration: d(0.4), ease: "power2.out" }, "<")
              .to(midBar ?? [], { opacity: 1, scaleX: 1, duration: d(0.35), ease: "power2.out" }, d(0.12))
          }
          // Return keyboard focus to the trigger once the panel is gone.
          tl.call(() => menuButton instanceof HTMLElement && menuButton.focus())
        }
        tl.set(navWrap, { display: "none" })
      }
    }, containerRef)

    return () => {
      // Deliberately NOT ctx.revert(): reverting would snap every inline
      // style (panel position, bar morph) back to its pre-animation state
      // before the close timeline runs, making the close invisible. Killing
      // keeps live inline state for the next run and drops only the tweens.
      ctx.kill()
    }
  }, [isMenuOpen])

  // Escape closes; body scroll locks while the menu is open.
  useEffect(() => {
    if (!isMenuOpen) return
    document.body.style.overflow = "hidden"
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onEsc)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onEsc)
    }
  }, [isMenuOpen])

  return (
    <div ref={containerRef} className={className}>
      <div className="site-header-wrapper">
        <header className="header">
          {preNav}
          <div className="container is--full">
            <nav className="nav-row">
              <a href={logoHref} aria-label="home" className="nav-logo-row">
                {logo}
              </a>
              <div className="nav-row__right">
                {controls}

                <Magnetic>
                  <button
                    type="button"
                    className="nav-close-btn"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-expanded={isMenuOpen}
                    aria-controls="kinetic-menu"
                    aria-label={isMenuOpen ? closeLabel : openLabel}
                  >
                    {/* Three bars morph into an ✕ when the menu opens. */}
                    <span className="menu-bars" aria-hidden="true">
                      <span className="menu-bar" />
                      <span className="menu-bar" />
                      <span className="menu-bar" />
                    </span>
                  </button>
                </Magnetic>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={() => setIsMenuOpen(false)} />
          <nav id="kinetic-menu" aria-label="Primary" className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />
            </div>

            <div className="menu-content-wrapper">
              <div className="menu-layout">
                <ul className="menu-list">
                  {links.map((link, i) => (
                    <li key={link.href} className="menu-list-item">
                      <a href={link.href} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                        <span className="nav-link-num" aria-hidden="true" data-menu-fade>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="nav-link-text" data-menu-fade>
                          {link.label}
                        </p>
                        <div className="nav-link-hover-bg" aria-hidden="true" />
                        <RowShapes variant={i % SHAPES} />
                      </a>
                    </li>
                  ))}
                </ul>
                {meta ? <aside className="menu-meta">{meta}</aside> : null}
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  )
}
