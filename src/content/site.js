/**
 * Site content.
 *
 * Everything here is data, so the layout can change without touching copy, and
 * copy can change without touching layout.
 *
 * HONESTY RULES FOR THIS FILE (see DESIGN.md and the antislop rules R-17, R-36, R-38):
 *   - Nothing in here may be invented. No fake numbers, awards, scores, or links.
 *   - Anything the owner has not supplied yet is `null` or a bracketed placeholder
 *     like `[ GitHub URL ]`, and the UI renders it as an explicit placeholder.
 *   - To activate a link or value: replace the placeholder with the real string.
 *     When a link has a real `href`, the UI stops drawing it as pending.
 */

export const person = {
  name: 'Khanh',
  // Kept only for the monogram next to the wordmark.
  nameAccented: 'Khánh',
  role: 'Student',
  // The one hand-drawn underline in the hero sits under this word.
  heroUnderline: 'problems',
  // Short line under the headline. One sentence, plain language.
  lede: 'I write C++, spend a lot of time on competitive programming, and run small AI experiments on the side. This page is where I keep the work and the notes.',
  // Hero eyebrow: a real label, not a category the headline already states.
  eyebrow: 'C++ / competitive programming / AI',
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Log', href: '#log' },
  { label: 'Reach', href: '#reach' },
]

export const about = {
  title: 'About',
  paragraphs: [
    'I am a student, and most of what I know I learned by breaking things and reading the error message carefully.',
    'Competitive programming is where I do the most deliberate practice: a problem, a time limit, and a wrong answer that tells me exactly which assumption was wrong. C++ is the language I reach for when the constraints are tight.',
    'Outside of contests I build smaller software, and I run AI experiments to understand how the models actually behave rather than how they are described.',
  ],
  // Honest placeholder: the owner fills this in.
  location: null, // e.g. 'Hanoi, Vietnam'
}

/**
 * The "how a run goes" strip. This is the owner's own described process, not a
 * claim about results. If it stops being accurate, edit or delete it.
 */
export const cycle = {
  title: 'How a problem usually goes',
  note: 'The shape of a normal session, not a promise about outcomes.',
  steps: [
    {
      name: 'Read it twice',
      detail: 'Constraints first. They decide the algorithm before the statement does.',
    },
    {
      name: 'Draw it out',
      detail: 'A small case on squared paper. If the drawing is confusing, the idea is not ready.',
      accent: true,
    },
    {
      name: 'Write it down',
      detail: 'C++, then the edge cases that break the first version.',
    },
    {
      name: 'Check the claim',
      detail: 'Stress test against a slow solution. A passing sample is not a proof.',
    },
  ],
}

export const now = {
  // Real and current: this site is being built. Replace when it changes.
  text: 'Building this site, and working through problems I keep getting wrong the first time.',
  link: {
    label: 'See the work',
    href: '#work',
  },
}

/**
 * Projects.
 *
 * Entry 1 is real: this site exists, and the description matches how it was built.
 * Entries 2 and 3 are template slots. They render with an explicit "template"
 * stamp and placeholder fields so they can never be mistaken for finished work.
 * Replace the placeholder strings with real projects, or delete the entries.
 */
export const projects = [
  {
    id: 'this-site',
    real: true,
    title: 'This site',
    role: 'Design and build',
    date: '2026',
    status: 'Building',
    statusActive: true,
    // This one artifact gets the hand-drawn pen frame.
    marked: true,
    summary:
      'A personal page that had to show real practice instead of a template. The direction comes from the squared notebook I solve on: grid paper, ink-navy text, and one red pen for the things that matter.',
    problem:
      'Most student portfolios look the same, and most of them exaggerate. I wanted one page that could be honest about what is finished and what is still an empty slot.',
    approach:
      'Hand-written CSS over Vite, React and Tailwind. Facts I could not verify were left as visible placeholders rather than filled with invented copy. Motion is limited to entry reveals and one pen stroke, all gated behind prefers-reduced-motion.',
    verification:
      'Keyboard order, contrast and reduced-motion behaviour are checked with automated accessibility and end-to-end tests before each release.',
    tags: ['C++', 'React', 'Tailwind', 'hand-written CSS'],
    links: [
      { label: 'Source', href: null, placeholder: '[ repository URL ]' },
      { label: 'Live', href: null, placeholder: '[ live site URL ]' },
    ],
  },
  {
    id: 'project-template-a',
    real: false,
    title: null,
    titlePlaceholder: '[ project name ]',
    role: null,
    rolePlaceholder: '[ your role ]',
    date: null,
    datePlaceholder: '[ year ]',
    status: '[ status ]',
    statusActive: false,
    summary: null,
    summaryPlaceholder: '[ one or two sentences: what it does and who it is for ]',
    problem: null,
    problemPlaceholder: '[ the problem it solves ]',
    approach: null,
    approachPlaceholder: '[ how you built it, and the one decision you are proud of ]',
    verification: null,
    verificationPlaceholder: '[ how you know it works ]',
    tags: [],
    tagsPlaceholder: '[ tags ]',
    links: [
      { label: 'Source', href: null, placeholder: '[ repository URL ]' },
      { label: 'Live', href: null, placeholder: '[ live site URL ]' },
    ],
  },
  {
    id: 'project-template-b',
    real: false,
    title: null,
    titlePlaceholder: '[ project name ]',
    role: null,
    rolePlaceholder: '[ your role ]',
    date: null,
    datePlaceholder: '[ year ]',
    status: '[ status ]',
    statusActive: false,
    summary: null,
    summaryPlaceholder: '[ one or two sentences: what it does and who it is for ]',
    problem: null,
    problemPlaceholder: '[ the problem it solves ]',
    approach: null,
    approachPlaceholder: '[ how you built it, and the one decision you are proud of ]',
    verification: null,
    verificationPlaceholder: '[ how you know it works ]',
    tags: [],
    tagsPlaceholder: '[ tags ]',
    links: [
      { label: 'Source', href: null, placeholder: '[ repository URL ]' },
    ],
  },
]

/**
 * Skills.
 *
 * `tier` is a self-assessment, not a measurement, and the UI says so. Only the
 * domains the owner described are listed. Add more rows as they become true.
 */
export const skills = {
  title: 'What I work with',
  note: 'Levels are my own read of where my time goes, not a ranking.',
  tiers: {
    focus: { label: 'Focus', ticks: 3 },
    building: { label: 'Building', ticks: 2 },
    exploring: { label: 'Exploring', ticks: 1 },
  },
  rows: [
    {
      name: 'C++',
      detail: 'The language I use for anything with a time limit. Standard library, pointers, and the parts that surprise you.',
      tier: 'focus',
    },
    {
      name: 'Data structures and algorithms',
      detail: 'Graphs, dynamic programming, and the habit of proving a solution before trusting it.',
      tier: 'focus',
    },
    {
      name: 'Competitive programming',
      detail: 'Contests as deliberate practice. Reading constraints, choosing the algorithm, and stress testing the result.',
      tier: 'focus',
    },
    {
      name: 'Software development',
      detail: 'Small tools and interfaces, version controlled and built to be read later.',
      tier: 'building',
    },
    {
      name: 'AI experiments',
      detail: 'Small tests to see how models behave, what they get wrong, and where a result actually came from.',
      tier: 'exploring',
    },
  ],
  morePlaceholder: '[ add another skill ]',
}

/**
 * Attempts glyph. This is deliberately abstract: it is a mindset picture, not a
 * scoreboard, and it makes no claim about any real contest result.
 */
export const attempts = {
  caption: 'One cell in six goes wrong. That is the useful one.',
  note: 'Not a scoreboard. A reminder that a wrong answer is information rather than a verdict.',
  // True = a rejected attempt. Exactly one red cell: the bar must match the
  // caption ("one cell in six"), or the picture contradicts its own words.
  cells: [false, false, false, false, true, false],
}

export const journal = {
  title: 'Practice log',
  lede: 'Short notes on what I solved, what broke, and what I would do differently. Kept honest, so most of them are boring.',
}

/**
 * Contact links.
 *
 * All are placeholders until the owner supplies real handles. A null `href`
 * renders as a pending row, never as a dead link.
 */
export const contact = {
  title: 'Reach out',
  lede: 'The quickest way to reach me is email. I read everything, and I answer questions about the problems I have worked through.',
  // Set a real address to enable the copy button. Left null on purpose: no invented email.
  email: null,
  links: [
    { name: 'GitHub', href: null, placeholder: '[ GitHub URL ]', icon: 'github' },
    { name: 'Discord', href: null, handle: null, handlePlaceholder: '[ handle ]', icon: 'discord' },
    { name: 'Facebook', href: null, placeholder: '[ Facebook URL ]', icon: 'facebook' },
    { name: 'Codeforces', href: null, placeholder: '[ Codeforces URL ]', icon: 'contest' },
    { name: 'LeetCode', href: null, placeholder: '[ LeetCode URL ]', icon: 'code' },
  ],
}

export const footer = {
  note: 'Built by hand. Every unverified fact on this page is a visible placeholder, not a guess.',
  meta: [
    'No trackers, no analytics.',
    'Placeholders are stored in src/content/site.js.',
  ],
}