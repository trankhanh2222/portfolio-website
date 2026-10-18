import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { SplitText } from "gsap/SplitText"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { useGSAP } from "@gsap/react"

/**
 * Single GSAP setup for the site: every animated component imports from here
 * so plugins register exactly once and the brand easing exists before use.
 *
 * "main" is the signature curve for ~80% of the site's motion (the kinetic
 * menu already created it; the parseEase guard makes that creation idempotent
 * no matter which module loads first).
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, SplitText, DrawSVGPlugin, ScrollTrigger, ScrollSmoother, useGSAP)
  if (!gsap.parseEase("main")) {
    CustomEase.create("main", "0.65, 0.01, 0.05, 0.99")
  }
}

/** True when the user asked for reduced motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export { gsap, SplitText, ScrollTrigger, ScrollSmoother, useGSAP }
