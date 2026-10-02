import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once it scrolls into view. If IntersectionObserver is
 * unavailable, the element is shown immediately with no animation.
 *
 * `delay` (ms) staggers sibling reveals; it is ignored under reduced motion.
 */
/**
 * Eased anchor scrolling for in-page links (nav, hero buttons, footer "up").
 * Native `scroll-behavior: smooth` is browser-controlled and abrupt on long
 * jumps; this animates with ease-in-out-quart sized by distance instead.
 * User input (wheel/touch/keys) cancels an in-flight glide.
 */
export function useSmoothAnchors() {
  useEffect(() => {
    let raf = 0;
    let animating = false;

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const cancel = () => {
      if (!animating) return;
      animating = false;
      cancelAnimationFrame(raf);
      document.documentElement.style.scrollBehavior = "";
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return;
      let section: Element | null = null;
      try {
        section = document.querySelector(hash);
      } catch {
        return;
      }
      if (!section) return;
      e.preventDefault();

      const header = document.querySelector<HTMLElement>(".site-header");
      const offset = (header?.offsetHeight ?? 0) + 12;
      const startY = window.scrollY;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const endY = Math.max(
        0,
        Math.min(startY + section.getBoundingClientRect().top - offset, maxY),
      );

      cancel();
      const distance = Math.abs(endY - startY);
      if (distance < 4) {
        history.pushState(null, "", hash);
        return;
      }
      // 450ms floor to ~850ms cap, scaled by distance.
      const duration = Math.min(850, Math.max(450, distance * 0.45));
      const started = performance.now();
      animating = true;
      // Auto while gliding so each scrollTo step lands instantly.
      document.documentElement.style.scrollBehavior = "auto";
      const step = (now: number) => {
        if (!animating) return;
        const p = Math.min(1, (now - started) / duration);
        window.scrollTo(0, startY + (endY - startY) * easeInOutQuart(p));
        if (p < 1) {
          raf = requestAnimationFrame(step);
        } else {
          cancel();
          history.pushState(null, "", hash);
        }
      };
      raf = requestAnimationFrame(step);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      cancel();
    };
  }, []);
}

export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInstant(true);
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return {
    ref,
    className: shown ? "reveal shown" : "reveal",
    style: !instant && delay > 0 ? { transitionDelay: `${delay}ms` } : undefined,
  };
}
