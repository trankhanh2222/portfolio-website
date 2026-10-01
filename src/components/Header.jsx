import { useCallback, useState } from 'react'
import { List, Moon, Sun, X } from '@phosphor-icons/react'
import { nav, person } from '../content/site.js'
import { useActiveSection, useEscape, useScrolled, useTheme } from '../hooks.js'
import { ICON_WEIGHT } from './primitives.jsx'

const SECTION_IDS = nav.map((item) => item.href.slice(1))

export default function Header() {
  const [theme, setTheme] = useTheme()
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const active = useActiveSection(SECTION_IDS)

  const close = useCallback(() => setOpen(false), [])
  useEscape(open, close)

  const isDark = theme === 'dark'
  const themeLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top-sentinel" aria-hidden="true" />
      <header className="site-header" data-scrolled={scrolled}>
        <div className="shell site-header__bar">
          <a className="wordmark" href="#top" onClick={close}>
            <span className="wordmark__monogram" aria-hidden="true">
              {person.nameAccented}
            </span>
            <span className="wordmark__name">{person.name}</span>
          </a>

          <nav className="nav" aria-label="Sections">
            {nav.map((item) => {
              const id = item.href.slice(1)
              const current = active === id
              return (
                <a
                  key={item.href}
                  className="nav-link"
                  href={item.href}
                  aria-current={current ? 'true' : undefined}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label={themeLabel}
              title={themeLabel}
            >
              {isDark ? (
                <Sun size={19} weight={ICON_WEIGHT} aria-hidden="true" />
              ) : (
                <Moon size={19} weight={ICON_WEIGHT} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="icon-button menu-button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <X size={19} weight={ICON_WEIGHT} aria-hidden="true" />
              ) : (
                <List size={19} weight={ICON_WEIGHT} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="mobile-nav" id="mobile-nav" data-open={open} hidden={!open}>
          <nav aria-label="Sections, mobile">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={close}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}