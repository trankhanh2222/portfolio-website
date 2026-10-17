"use client"

import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"

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
  /** Small controls (language/theme) between the hint and the menu button. */
  controls?: React.ReactNode
  /** Decorative affordance label next to the menu button. */
  hint?: string
  /** Menu button labels (the button swaps between the two). */
  openLabel: string
  closeLabel: string
  className?: string
}

// CustomEase ships free with gsap ≥ 3.13; registration is browser-only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase)
}

const MAX_SHAPES = 5

export function KineticNavigation({
  preNav,
  logo,
  logoHref = "#top",
  links,
  controls,
  hint,
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

      const menuItems = container.querySelectorAll(".menu-list-item[data-shape]")
      const shapesContainer = container.querySelector(".ambient-background-shapes")

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape")
        const shape = shapesContainer?.querySelector(`.bg-shape-${shapeIndex}`)
        if (!shape) return
        const shapeEls = shape.querySelectorAll(".shape-element")

        const onEnter = () => {
          shapesContainer?.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"))
          shape.classList.add("active")
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: d(0.6), stagger: d(0.08), ease: "back.out(1.7)", overwrite: "auto" },
          )
        }
        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: d(0.3),
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
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
      const menuButtonTexts = menuButton?.querySelectorAll(".menu-button-text p")
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon")
      if (!navWrap || !menu) return

      const tl = gsap.timeline()
      if (isMenuOpen) {
        navWrap.setAttribute("data-nav", "open")
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonTexts ?? [], { yPercent: 0 }, { yPercent: -100, stagger: d(0.08), duration: d(0.25) })
          .fromTo(menuButtonIcon ?? [], { rotate: 0 }, { rotate: 315, duration: d(0.5) }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: d(0.3) }, "<")
          .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: d(0.12), duration: d(0.575) }, "<")
          .fromTo(
            menuLinks,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: d(0.05), duration: d(0.6) },
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
        tl.to(overlay, { autoAlpha: 0, duration: d(0.3) })
          .to(menu, { xPercent: 120, duration: d(0.5) }, "<")
          .to(menuButtonTexts ?? [], { yPercent: 0, duration: d(0.25) }, "<")
          .to(menuButtonIcon ?? [], { rotate: 0, duration: d(0.5) }, "<")
          .set(navWrap, { display: "none" })
        // Initial mount also runs this branch — only refocus after a real open.
        if (wasOpenRef.current) {
          wasOpenRef.current = false
          tl.call(() => menuButton instanceof HTMLElement && menuButton.focus())
        }
      }
    }, containerRef)

    return () => {
      ctx.revert()
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
                {/* Decorative clickable hint mirroring the template; the real
                    accessible trigger is the button right next to it. */}
                {hint && (
                  <div
                    className="nav-toggle-label"
                    aria-hidden="true"
                    onClick={() => setIsMenuOpen(true)}
                  >
                    <span className="toggle-text">{hint}</span>
                  </div>
                )}

                {controls}

                <button
                  type="button"
                  className="nav-close-btn"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-expanded={isMenuOpen}
                  aria-controls="kinetic-menu"
                  aria-label={openLabel}
                >
                  <div className="menu-button-text">
                    <p className="p-large">{openLabel}</p>
                    <p className="p-large">{closeLabel}</p>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="menu-button-icon"
                    >
                      <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor" />
                      <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
                      <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
                      <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
                      <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
                      <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
                    </svg>
                  </div>
                </button>
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

              {/* Abstract shapes recolored to the signal-orange palette. */}
              <div className="ambient-background-shapes">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(249,83,31,0.14)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(249,83,31,0.10)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(255,138,90,0.09)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(249,83,31,0.14)" />
                </svg>
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <path className="shape-element" d="M0 200 Q100 100, 200 200 T 400 200" stroke="rgba(249,83,31,0.20)" strokeWidth="60" fill="none" />
                  <path className="shape-element" d="M0 280 Q100 180, 200 280 T 400 280" stroke="rgba(255,138,90,0.14)" strokeWidth="40" fill="none" />
                </svg>
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(249,83,31,0.30)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(249,83,31,0.24)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(255,138,90,0.28)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(249,83,31,0.22)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(249,83,31,0.20)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(255,138,90,0.22)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(249,83,31,0.18)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(255,138,90,0.26)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(249,83,31,0.26)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(249,83,31,0.24)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(255,138,90,0.24)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(249,83,31,0.30)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(249,83,31,0.24)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(255,138,90,0.28)" />
                </svg>
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <path className="shape-element" d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill="rgba(249,83,31,0.12)" />
                  <path className="shape-element" d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill="rgba(255,138,90,0.09)" />
                </svg>
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none" aria-hidden="true">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(249,83,31,0.16)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(249,83,31,0.12)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(255,138,90,0.10)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {links.map((link, i) => (
                  <li key={link.href} className="menu-list-item" data-shape={String((i % MAX_SHAPES) + 1)}>
                    <a href={link.href} className="nav-link" onClick={() => setIsMenuOpen(false)}>
                      <p className="nav-link-text" data-menu-fade>
                        {link.label}
                      </p>
                      <div className="nav-link-hover-bg" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  )
}
