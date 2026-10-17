"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { site, type Content, type Locale } from "@/content/site"

export const LOCALE_STORAGE_KEY = "portfolio-locale"

type LanguageContextValue = {
  locale: Locale
  t: Content
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")

  // Restore the stored choice after mount. The EN↔VI swap animates through
  // MorphText, so the correction reads as a transition rather than a flash.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    } catch {
      // localStorage unavailable (private mode); keep the default.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors next-themes' hydration pattern: the server default renders first, the stored choice applies right after mount
    if (stored === "vi" || stored === "en") setLocaleState(stored)
  }, [])

  // Keep <html lang> and the document title in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale === "vi" ? "vi" : "en"
    document.title = site[locale].meta.title
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // Ignore write failures; the choice still applies for this visit.
    }
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === "en" ? "vi" : "en"
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
      } catch {
        // Ignore write failures; the choice still applies for this visit.
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ locale, t: site[locale], setLocale, toggle }),
    [locale, setLocale, toggle],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>")
  }
  return ctx
}
