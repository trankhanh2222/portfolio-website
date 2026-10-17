/**
 * The SVG threshold filter the morph text relies on. Rendered once, globally,
 * in <body>; every MorphText references it by id. The filter sharpens the
 * alpha channel so the two morphing layers read as solid glyphs, not ghosting.
 */
export function ThresholdFilter() {
  return (
    <svg aria-hidden="true" className="pointer-events-none fixed h-0 w-0" focusable="false">
      <defs>
        <filter id="threshold">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  )
}
