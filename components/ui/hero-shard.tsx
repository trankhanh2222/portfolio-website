"use client"

import * as React from "react"
import * as THREE from "three"

import { gsap, prefersReducedMotion } from "@/lib/gsap"

/**
 * HeroShard — a small crystal of points floating behind the hero copy.
 *
 * Experimental focal point: ~600 dots sampled along the edges of a
 * hexagonal bipyramid (apex sparkle comes free — twelve edges meet at each
 * pole), slowly turning, twinkling per-dot, dimming with depth. Same
 * material family as the sonar scene (one ShaderMaterial, round dots,
 * colorspace-correct primary) but with size attenuation so the crystal
 * reads as real 3D. Renders continuously while visible — a 630px square at
 * ≤1.5 DPR, one draw call — and pauses entirely off-screen or on a hidden
 * tab; the pose freezes under reduced motion. Mounted only by HeroFocal,
 * which owns the eligibility gates and lazy import.
 */

const DPR_CAP = 1.5
const BODY_RADIUS = 0.5
const APEX = 1.18
const POINT_COUNT = 1000
const CORE_POINTS = 45
const DOT_WORLD_SIZE = 0.015
const FOV = 35
const CAMERA_Z = 6.4

const VERTEX_SHADER = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;

  attribute float aPhase;
  attribute float aScale;

  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mv;

    float twinkle = 0.8 + 0.2 * sin(uTime * 1.3 + aPhase);
    float depth = clamp((mv.z + 7.3) / 1.9, 0.0, 1.0);
    vAlpha = mix(0.3, 1.0, depth) * twinkle;

    gl_PointSize = uSize * aScale * twinkle * (uScale / -mv.z);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float edge = 1.0 - smoothstep(0.35, 0.5, d);
    if (edge <= 0.001) discard;
    gl_FragColor = vec4(uColor, vAlpha * uOpacity * edge);
    #include <colorspace_fragment>
  }
`

function buildShardGeometry(): THREE.BufferGeometry {
  const ringCount = 6
  const ring: THREE.Vector3[] = []
  for (let i = 0; i < ringCount; i++) {
    const a = (i / ringCount) * Math.PI * 2
    ring.push(
      new THREE.Vector3(
        Math.cos(a) * BODY_RADIUS,
        i % 2 === 0 ? 0.07 : -0.05,
        Math.sin(a) * BODY_RADIUS,
      ),
    )
  }

  const top = new THREE.Vector3(0, APEX, 0)
  const bottom = new THREE.Vector3(0, -APEX, 0)
  const segments: Array<[THREE.Vector3, THREE.Vector3]> = []
  for (let i = 0; i < ringCount; i++) {
    segments.push([top, ring[i]!])
    segments.push([bottom, ring[i]!])
    segments.push([ring[i]!, ring[(i + 1) % ringCount]!])
  }

  const lengths = segments.map(([a, b]) => a.distanceTo(b))
  const total = lengths.reduce((sum, l) => sum + l, 0)

  const positions: number[] = []
  const phases: number[] = []
  const scales: number[] = []
  for (let s = 0; s < segments.length; s++) {
    const count = Math.max(2, Math.round((lengths[s]! / total) * POINT_COUNT))
    const [a, b] = segments[s]!
    for (let k = 0; k < count; k++) {
      const t = (k + Math.random()) / count
      positions.push(
        a.x + (b.x - a.x) * t + (Math.random() - 0.5) * 0.03,
        a.y + (b.y - a.y) * t + (Math.random() - 0.5) * 0.03,
        a.z + (b.z - a.z) * t + (Math.random() - 0.5) * 0.03,
      )
      phases.push(Math.random() * Math.PI * 2)
      scales.push(0.7 + Math.random() * 0.6)
    }
  }

  // A faint spindle of points down the vertical axis so the crystal still
  // reads as a solid when the edge lines are at their faintest.
  for (let k = 0; k < CORE_POINTS; k++) {
    const y = -0.95 + (k / (CORE_POINTS - 1)) * 1.9
    positions.push(
      (Math.random() - 0.5) * 0.04,
      y + (Math.random() - 0.5) * 0.04,
      (Math.random() - 0.5) * 0.04,
    )
    phases.push(Math.random() * Math.PI * 2)
    scales.push(0.45 + Math.random() * 0.3)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(new Float32Array(phases), 1))
  geometry.setAttribute("aScale", new THREE.BufferAttribute(new Float32Array(scales), 1))
  return geometry
}

export function HeroShard({ className }: { className?: string }) {
  const hostRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
    renderer.setPixelRatio(dpr)
    renderer.setClearAlpha(0)
    // The class carries the theme color; readColor() resolves it to RGB.
    renderer.domElement.className = "text-primary"
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0"
    renderer.domElement.setAttribute("aria-hidden", "true")
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 40)
    camera.position.set(0, 0, CAMERA_Z)

    const uniforms = {
      uSize: { value: DOT_WORLD_SIZE },
      uScale: { value: 1000 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(1, 0.33, 0.12) },
      uOpacity: { value: 1 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    const geometry = buildShardGeometry()
    const shard = new THREE.Points(geometry, material)
    shard.frustumCulled = false
    scene.add(shard)

    // ——— theme color via the same 1px probe as the sonar scene ———
    const probe = document.createElement("canvas")
    probe.width = 1
    probe.height = 1
    const probeCtx = probe.getContext("2d", { willReadFrequently: true })
    const readColor = () => {
      if (!probeCtx) return
      const css = getComputedStyle(renderer.domElement).color
      probeCtx.clearRect(0, 0, 1, 1)
      probeCtx.fillStyle = css
      probeCtx.fillRect(0, 0, 1, 1)
      const data = probeCtx.getImageData(0, 0, 1, 1).data
      uniforms.uColor.value.setRGB(
        (data[0] ?? 0) / 255,
        (data[1] ?? 0) / 255,
        (data[2] ?? 0) / 255,
        THREE.SRGBColorSpace,
      )
      renderer.render(scene, camera)
    }

    // ——— sizing ———
    const applySize = () => {
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // World units -> device pixels at z = 0 (size attenuation divides by -mv.z).
      uniforms.uScale.value =
        (h * dpr) / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))
    }

    // ——— loop: continuous while the hero is on screen and the tab is visible
    let raf = 0
    let visible = true
    let t0 = performance.now()
    let lastNow = 0

    const tick = (now: number) => {
      raf = 0
      if (document.hidden || !visible || prefersReducedMotion()) return
      lastNow = now
      const t = (now - t0) / 1000
      shard.rotation.y = t * 0.22
      shard.rotation.x = Math.sin(t * 0.16) * 0.09
      shard.position.y = Math.sin(t * 0.28) * 0.05
      uniforms.uTime.value = t
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (raf || document.hidden || !visible || prefersReducedMotion()) return
      // Re-anchor the clock so the crystal resumes where it paused.
      if (lastNow) t0 += performance.now() - lastNow
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting
        if (visible) kick()
      },
      { threshold: 0 },
    )
    io.observe(host)

    const ro = new ResizeObserver(() => {
      applySize()
      renderer.render(scene, camera)
    })
    ro.observe(host)

    const onVisibility = () => {
      if (!document.hidden) kick()
    }
    document.addEventListener("visibilitychange", onVisibility)

    const mo = new MutationObserver(readColor)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })

    readColor()
    applySize()
    kick()

    // Fade in after the hero's own timeline has settled the copy.
    const fade = gsap.fromTo(
      renderer.domElement,
      { opacity: 0 },
      { opacity: 0.32, duration: 1.6, delay: 0.55, ease: "power2.out" },
    )

    return () => {
      fade.kill()
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" className={className} />
}
