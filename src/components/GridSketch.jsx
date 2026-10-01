/**
 * The hero artifact: a pencil sketch of a grid graph with a marked shortest
 * path. It is the object the whole direction is taken from: the drawing a
 * competitive programmer makes before writing the real code.
 *
 * This is a deliberate, labeled exception to the "no hand-rolled SVG" rule. It
 * is not an icon and not a fake screenshot, it is the page's identity motif:
 * the same grid, the same red pen, that the rest of the site is built around.
 * It carries no fabricated data, only a small legend in the caption.
 */
export default function GridSketch() {
  return (
    <svg
      className="sketch__figure"
      viewBox="0 0 360 300"
      role="img"
      aria-labelledby="sketch-title sketch-desc"
    >
      <title id="sketch-title">Pencil sketch of a grid graph with a route marked in red</title>
      <desc id="sketch-desc">
        A nine by seven grid of nodes. Most edges are drawn in grey pencil. One path from the
        bottom-left node to a node at the top-right is drawn in red and marked with an arrowhead,
        the way you would circle a route to a target.
      </desc>

      <defs>
        <marker
          id="sketch-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,1 L9,5 L0,9 z" fill="var(--red)" />
        </marker>
      </defs>

      {/* nodes */}
      <g fill="var(--pencil)">
        {Array.from({ length: 7 }, (_, row) =>
          Array.from({ length: 9 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={30 + col * 37.5} cy={30 + row * 37.5} r="2.1" />
          )),
        )}
      </g>

      {/* pencil edges: a sparse spanning set, drawn by hand so it wavers */}
      <g stroke="var(--pencil)" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5">
        {[
          [0, 0, 1, 0], [1, 0, 2, 0], [2, 0, 3, 0], [4, 0, 5, 0], [6, 0, 7, 0],
          [0, 1, 1, 1], [2, 1, 3, 1], [5, 1, 6, 1], [7, 1, 8, 1],
          [1, 2, 2, 2], [3, 2, 4, 2], [6, 2, 7, 2],
          [0, 3, 1, 3], [4, 3, 5, 3], [7, 3, 8, 3],
          [2, 4, 3, 4], [5, 4, 6, 4], [6, 4, 7, 4],
          [0, 5, 1, 5], [3, 5, 4, 5], [7, 5, 8, 5],
          [1, 6, 2, 6], [4, 6, 5, 6], [6, 6, 7, 6],
        ].map(([c1, r1, c2, r2], index) => {
          const x1 = 30 + c1 * 37.5
          const y1 = 30 + r1 * 37.5
          const x2 = 30 + c2 * 37.5
          const y2 = 30 + r2 * 37.5
          // a gentle bow on each edge so it reads as drawn, not plotted
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2 + (index % 2 ? 1.4 : -1.2)
          return <path key={index} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} />
        })}
        {[
          [0, 6, 0, 5], [1, 5, 1, 4], [1, 4, 1, 3], [2, 3, 2, 2], [2, 2, 2, 1],
          [3, 1, 3, 0], [4, 3, 4, 2], [5, 2, 5, 1], [6, 1, 6, 0], [7, 0, 7, 1],
          [3, 6, 3, 5], [4, 5, 4, 4], [5, 6, 5, 5],
        ].map(([c1, r1, c2, r2], index) => {
          const x1 = 30 + c1 * 37.5
          const y1 = 30 + r1 * 37.5
          const x2 = 30 + c2 * 37.5
          const y2 = 30 + r2 * 37.5
          const mx = (x1 + x2) / 2 + (index % 2 ? -1.3 : 1.1)
          const my = (y1 + y2) / 2
          return <path key={index} d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} />
        })}
      </g>

      {/* the marked route, in red, with one arrowhead at the target */}
      <path
        d="M30,255 L30,217.5 L67.5,217.5 L105,217.5 L105,180 L105,142.5 L142.5,142.5 L180,142.5 L180,105 L217.5,105 L255,105 L255,67.5 L292.5,67.5 L330,67.5"
        fill="none"
        stroke="var(--red)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#sketch-arrow)"
      />

      {/* start and target nodes */}
      <circle cx="30" cy="255" r="4.6" fill="var(--paper-2)" stroke="var(--red)" strokeWidth="2" />
      <circle cx="330" cy="67.5" r="5" fill="var(--red)" />
    </svg>
  )
}