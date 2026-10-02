import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "./content/lang/en";
import { vi } from "./content/lang/vi";
import type { SiteContent } from "./content/site";

export type Lang = "vi" | "en";
export type Theme = "light" | "dark";

const STORAGE_LOCALE = "portfolio-locale";
const STORAGE_THEME = "portfolio-theme";

/** Read by main.tsx before React mounts so there is no theme flash. */
export const readStoredTheme = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_THEME);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};

export const readStoredLang = (): Lang | null => {
  try {
    const v = localStorage.getItem(STORAGE_LOCALE);
    return v === "vi" || v === "en" ? v : null;
  } catch {
    return null;
  }
};

const initialTheme = (): Theme =>
  readStoredTheme() ??
  (typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

const initialLang = (): Lang =>
  readStoredLang() ?? (navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en");

type SiteContextValue = {
  lang: Lang;
  theme: Theme;
  t: SiteContent;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "vi" ? vi.docTitle : en.docTitle;
    try {
      localStorage.setItem(STORAGE_LOCALE, lang);
    } catch {
      /* private mode */
    }
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#181613" : "#faf6ef");
    try {
      localStorage.setItem(STORAGE_THEME, theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((v) => (v === "vi" ? "en" : "vi")),
    [],
  );
  const toggleTheme = useCallback(
    () => setTheme((v) => (v === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo<SiteContextValue>(
    () => ({
      lang,
      theme,
      t: lang === "vi" ? vi : en,
      setLang,
      toggleLang,
      toggleTheme,
    }),
    [lang, theme, setLang, toggleLang, toggleTheme],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}
