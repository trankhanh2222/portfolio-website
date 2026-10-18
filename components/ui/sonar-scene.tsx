"use client"

import * as React from "react"
import * as THREE from "three"
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap"

/**
 * SonarScene — the sonar field as a 3D point plane (three.js).
 *
 * Same language as the 2D SonarGrid (identical spacing/opacities/ring
 * speeds/glow falloffs — see the constants) but the dots live on a plane
 * tilted −9° in perspective: edges recede, click pings travel across the
 * surface, and the wavefront lifts the dots toward the viewer. One draw
 * call, one ShaderMaterial, no lights. Renders on demand only: while a
 * ring lives, while the trail/glow are still easing, or on explicit
 * invalidation (resize, theme change, visibility) — an idle page costs
 * zero frames. Loaded lazily by SonarField only for fine pointers ≥768px
 * without reduced motion; everyone else keeps the 2D canvas.
 */

const SPACING = 26
const DOT_RADIUS = 1.4
const BASE_OPACITY = 0.28
const RING_WIDTH = 86
const RING_SPEED = 240
const AMPLITUDE = 2.1
const MAX_RINGS = 6
const GLOW_RADIUS = 150
const GLOW_LERP = 0.12
const TRAIL_LERP = 0.16
const TILT_DEG = -9
const DPR_CAP = 1.5
const MAX_POINTS = 9000

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAmplitude;
  uniform float uRingSpeed;
  uniform float uRingWidth;
  uniform float uLifetime;
  uniform vec3 uRings[${MAX_RINGS}];
  uniform int uRingCount;
  uniform vec2 uCursor;
  uniform float uGlowRadius;
  uniform float uGlow;
  uniform float uLift;
  uniform float uHalfHeight;

  varying float vEnergy;
  varying float vFade;

  float ringEnergy(vec2 p, vec3 ring) {
    float age = uTime - ring.z;
    if (age < 0.0 || age > uLifetime) return 0.0;
    float radius = age * uRingSpeed;
    float dist = abs(distance(p, ring.xy) - radius);
    if (dist >= uRingWidth) return 0.0;
    float t = 1.0 - dist / uRingWidth;
    return t * t * (3.0 - 2.0 * t) * (1.0 - age / uLifetime);
  }

  void main() {
    vec3 pos = position;
    float energy = 0.0;
    for (int i = 0; i < ${MAX_RINGS}; i++) {
      if (i >= uRingCount) break;
      energy = max(energy, ringEnergy(pos.xy, uRings[i]));
    }
    if (uGlow > 0.001) {
      float d = distance(pos.xy, uCursor);
      if (d < uGlowRadius) {
        float t = 1.0 - d / uGlowRadius;
        energy = max(energy, t * t * (3.0 - 2.0 * t) * uGlow);
      }
    }
    vEnergy = energy;
    // Horizon attenuation: the far (top) edge sits a touch deeper.
    vFade = 1.0 - 0.3 * smoothstep(-0.2, 0.5, pos.y / uHalfHeight);

    pos.z += energy * uLift;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + uAmplitude * energy) * uPixelRatio;
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBaseOpacity;

  varying float vEnergy;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float edge = 1.0 - smoothstep(0.42, 0.5, d);
    if (edge <= 0.001) discard;
    float alpha = (uBaseOpacity + (1.0 - uBaseOpacity) * vEnergy) * edge * vFade;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`

export function SonarScene({ className }: { className?: string }) {
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
      "position:absolute;inset:0;width:100%;height:100%;display:block"
    renderer.domElement.setAttribute("aria-hidden", "true")
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 1, 20000)

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: DOT_RADIUS * 2 },
      uPixelRatio: { value: dpr },
      uColor: { value: new THREE.Color(1, 0.33, 0.12) },
      uBaseOpacity: { value: BASE_OPACITY },
      uAmplitude: { value: AMPLITUDE },
      uRingSpeed: { value: RING_SPEED },
      uRingWidth: { value: RING_WIDTH },
      uLifetime: { value: 8 },
      uRings: { value: Array.from({ length: MAX_RINGS }, () => new THREE.Vector3()) },
      uRingCount: { value: 0 },
      uCursor: { value: new THREE.Vector2() },
      uGlowRadius: { value: GLOW_RADIUS },
      uGlow: { value: 0 },
      uLift: { value: 46 },
      uHalfHeight: { value: 450 },
    }

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    const pointsRoot = new THREE.Group()
    pointsRoot.rotation.x = THREE.MathUtils.degToRad(TILT_DEG)
    scene.add(pointsRoot)

    let points: THREE.Points | null = null
    let width = 0
    let height = 0
    let lifetime = 8
    let raf = 0
    let force = true

    // ——— cursor & rings (plane-local coordinates, y up) ———
    const cursor = { x: -99999, y: -99999, tx: -99999, ty: -99999, glow: 0, active: false }
    let cursorDirty = true
    let rings: { x: number; y: number; born: number }[] = []

    const nowS = () => performance.now() / 1000

    // ——— client point -> plane-local point (exact, respects the tilt) ———
    const raycaster = new THREE.Raycaster()
    const planeMath = new THREE.Plane()
    const normalVec = new THREE.Vector3()
    const hit = new THREE.Vector3()
    const ndc = new THREE.Vector2()
    const planeHit = new THREE.Vector2()

    const toLocal = (clientX: number, clientY: number): THREE.Vector2 | null => {
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return null
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -(((clientY - rect.top) / rect.height) * 2 - 1),
      )
      raycaster.setFromCamera(ndc, camera)
      pointsRoot.updateMatrixWorld()
      normalVec.set(0, 0, 1).applyQuaternion(pointsRoot.quaternion).normalize()
      planeMath.setFromNormalAndCoplanarPoint(normalVec, pointsRoot.position)
      if (!raycaster.ray.intersectPlane(planeMath, hit)) return null
      pointsRoot.worldToLocal(hit)
      return planeHit.set(hit.x, hit.y)
    }

    // ——— theme color: resolve any CSS color to exact RGB via a 1px canvas ———
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
      requestRender()
    }

    // ——— on-demand loop ———
    const tick = () => {
      raf = 0
      if (document.hidden) return // visibilitychange re-wakes
      const now = nowS()
      const reduce = prefersReducedMotion()

      if (reduce) rings = []
      rings = rings.filter((r) => now - r.born < lifetime)

      const glowTarget = cursor.active && !reduce ? 1 : 0
      cursor.x += (cursor.tx - cursor.x) * TRAIL_LERP
      cursor.y += (cursor.ty - cursor.y) * TRAIL_LERP
      cursor.glow += (glowTarget - cursor.glow) * GLOW_LERP

      const trailSettled =
        Math.abs(cursor.x - cursor.tx) <= 0.5 && Math.abs(cursor.y - cursor.ty) <= 0.5
      const glowSettled = Math.abs(cursor.glow - glowTarget) <= 0.002
      const needs = force || rings.length > 0 || cursorDirty || !trailSettled || !glowSettled
      cursorDirty = false
      force = false

      if (needs) {
        uniforms.uTime.value = now
        uniforms.uRingCount.value = rings.length
        rings.forEach((r, i) => uniforms.uRings.value[i]?.set(r.x, r.y, r.born))
        uniforms.uCursor.value.set(cursor.x, cursor.y)
        uniforms.uGlow.value = cursor.glow
        renderer.render(scene, camera)
      }

      if (rings.length > 0 || cursorDirty || !trailSettled || !glowSettled) {
        raf = requestAnimationFrame(tick)
      }
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const requestRender = () => {
      force = true
      wake()
    }

    // ——— grid ———
    const rebuild = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))
      renderer.setSize(width, height, false)

      camera.aspect = width / height
      const halfH = height / 2
      const dist = halfH / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.set(0, 0, dist)
      camera.near = 1
      camera.far = dist * 4
      camera.updateProjectionMatrix()

      const cols = Math.min(Math.floor(width / SPACING) + 1, 400)
      const rows = Math.min(Math.floor(height / SPACING) + 1, 400)
      const count = Math.min(cols * rows, MAX_POINTS)
      const positions = new Float32Array(count * 3)
      const offsetX = (width - (cols - 1) * SPACING) / 2
      const offsetY = (height - (rows - 1) * SPACING) / 2
      let n = 0
      for (let i = 0; i < cols; i++) {
        const x2 = offsetX + i * SPACING
        for (let j = 0; j < rows; j++) {
          positions[n * 3] = x2 - width / 2
          positions[n * 3 + 1] = height / 2 - (offsetY + j * SPACING)
          positions[n * 3 + 2] = 0
          n++
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      if (!points) {
        points = new THREE.Points(geometry, material)
        points.frustumCulled = false
        pointsRoot.add(points)
      } else {
        points.geometry.dispose()
        points.geometry = geometry
      }

      lifetime = (Math.hypot(width, height) + RING_WIDTH) / RING_SPEED
      uniforms.uLifetime.value = lifetime
      uniforms.uHalfHeight.value = halfH
      requestRender()
    }

    // ——— input (same contract as the 2D field: taps anywhere ring it) ———
    const onDown = (e: PointerEvent) => {
      if (prefersReducedMotion()) return
      const p = toLocal(e.clientX, e.clientY)
      if (!p) return
      rings.push({ x: p.x, y: p.y, born: nowS() })
      while (rings.length > MAX_RINGS) rings.shift()
      wake()
    }
    const onMove = (e: PointerEvent) => {
      if (prefersReducedMotion()) return
      const p = toLocal(e.clientX, e.clientY)
      if (!p) return
      cursor.tx = p.x
      cursor.ty = p.y
      if (!cursor.active) {
        // (Re)entering: start the trail at the pointer.
        cursor.x = p.x
        cursor.y = p.y
      }
      cursor.active = true
      cursorDirty = true
      wake()
    }
    const onLeave = () => {
      if (!cursor.active) return
      cursor.active = false
      cursorDirty = true
      wake()
    }
    const onVisibility = () => {
      if (!document.hidden) requestRender()
    }
    const onMotionPref = () => requestRender()

    // ——— scroll pose: as the page travels bottom-ward the plane eases its
    // pitch ±4° around the rest tilt with a whisper of yaw, so the field
    // subtly re-aims instead of sitting rigidly behind the content. Driven
    // by ScrollTrigger progress (smoother-aware) and rendered by the same
    // on-demand loop: one frame per update, zero while the scroll is still.
    const REST_TILT = THREE.MathUtils.degToRad(TILT_DEG)
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (prefersReducedMotion()) return
        const p = self.progress - 0.5
        pointsRoot.rotation.x = REST_TILT + THREE.MathUtils.degToRad(p * 8)
        pointsRoot.rotation.y = THREE.MathUtils.degToRad(p * -4)
        wake()
      },
    })

    const ro = new ResizeObserver(rebuild)
    const mo = new MutationObserver(readColor)
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)")

    readColor()
    rebuild()
    ro.observe(host)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    motionMq.addEventListener("change", onMotionPref)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      motionMq.removeEventListener("change", onMotionPref)
      st.kill()
      points?.geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} data-slot="sonar-scene" aria-hidden="true" className={className} />
}
