/**
 * ALL editable content for the site lives in this file.
 *
 * How to make it yours:
 *  - Replace the bracketed values (like `[GitHub URL]`) with real strings.
 *  - Anything still wrapped in square brackets renders as an honest placeholder
 *    in the UI, never as a fake link. Placeholder URLs are detected by the
 *    `isPlaceholder()` helper below, so you do not need to touch components.
 *  - Add or remove entries in the arrays; the layout adapts.
 *
 * Honesty rules for this file:
 *  - No invented achievements, statistics, credentials, or testimonials.
 *  - Example text is realistic so the page looks complete, but is clearly
 *    generic and easy to swap for your own.
 */

export type Project = {
  name: string;
  year: string;
  summary: string;
  detail: string;
  stack: string[];
  githubUrl: string;
  demoUrl: string;
  /** Set to true to render the showcase large (one feature, then smaller rows). */
  featured: boolean;
  /**
   * Optional real screenshot path under /public (e.g. "/images/chess.svg").
   * While null, the UI draws a deliberate placeholder panel, not a stock image.
   */
  image: string | null;
  /** Caption shown under the placeholder/screenshot. */
  imageCaption: string;
};

export type TimelineEntry = {
  period: string;
  title: string;
  text: string;
};

/** A bracketed string like `[GitHub URL]` is treated as an unset placeholder. */
export const isPlaceholder = (value: string): boolean =>
  value.trim().startsWith("[") && value.trim().endsWith("]");

export const person = {
  name: "Khánh",
  role: "Student · Programmer · Creator",
  tagline: "Curious about technology. Driven to build things.",
  intro:
    "I enjoy exploring ideas, solving problems, and turning what I learn into projects.",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const about = {
  lead: "I'm a student interested in programming, technology, and creative experimentation. I enjoy learning by building things and exploring how ideas work in practice.",
  body: [
    "Most of what I know, I picked up by taking something apart and putting it back together. A class introduces the idea, a project makes me understand it.",
    "Right now I'm learning how to make software that feels good to use, not just software that works. That means a lot of small experiments: a game engine in the weekend, a tool I needed at 2am, a simulation of something I was wondering about.",
  ],
  learning: "Currently learning: game dev and how machine learning models actually behave under the hood.",
};

/**
 * Sample projects with clearly marked example data.
 * Replace name, text, and URLs with your own. `featured: true` gets the large
 * showcase; at most one or two should be featured.
 */
export const projects: Project[] = [
  {
    name: "[Project Name]",
    year: "[Year]",
    summary: "A short description of what this project does and the problem it explores.",
    detail:
      "Example text. Replace with two or three sentences: what the project does, the problem it explores, and how it was built. What was hard, what you learned, what you would change.",
    stack: ["[Tech]", "[Tech]", "[Tech]"],
    githubUrl: "[GitHub URL]",
    demoUrl: "[Live Demo URL]",
    featured: true,
    image: null,
    imageCaption: "[Project Screenshot] goes here",
  },
  {
    name: "[Project Name]",
    year: "[Year]",
    summary: "Another example entry. A tool, a game, an experiment: whatever you actually built.",
    detail:
      "Example text. Describe the second project the same way: the idea behind it, how it works, and what you took away from building it.",
    stack: ["[Tech]", "[Tech]"],
    githubUrl: "[GitHub URL]",
    demoUrl: "[Live Demo URL]",
    featured: false,
    image: null,
    imageCaption: "[Project Screenshot] goes here",
  },
  {
    name: "[Project Name]",
    year: "[Year]",
    summary: "A third example slot so the section reads complete before your real projects land.",
    detail:
      "Example text. Use this entry for a smaller experiment or a school project. Short and honest beats long and impressive.",
    stack: ["[Tech]", "[Tech]"],
    githubUrl: "[GitHub URL]",
    demoUrl: "",
    featured: false,
    image: null,
    imageCaption: "[Project Screenshot] goes here",
  },
];

export const interests = [
  {
    name: "Programming",
    note: "Building small tools and seeing where they go.",
  },
  {
    name: "Competitive programming",
    note: "Problems with a time limit and a clear right answer.",
  },
  {
    name: "AI experiments",
    note: "Poking at models to see how they behave, not just what they claim.",
  },
  {
    name: "Minecraft",
    note: "Redstone is programming with a different font.",
  },
  {
    name: "Creative projects",
    note: "Anything at the seam between code and design.",
  },
];

/**
 * Skills are a plain grouped list. No percentages, no bars: nothing here
 * claims a level that hasn't been earned.
 */
export const skillGroups = [
  {
    group: "Languages",
    items: ["C++", "Python", "JavaScript", "TypeScript"],
  },
  {
    group: "Web",
    items: ["React", "HTML", "CSS", "Vite"],
  },
  {
    group: "Tools",
    items: ["Git", "VS Code", "Linux (WSL)"],
  },
];

/**
 * Example milestones. Replace every date and event with your own.
 * The section header states plainly that these are placeholders.
 */
export const journey: TimelineEntry[] = [
  {
    period: "[Year]",
    title: "[First line of code]",
    text: "Example entry. Write the moment you got hooked: the first program that ran, the first game mod that worked, the first problem you solved on your own.",
  },
  {
    period: "[Year]",
    title: "[A project or contest worth remembering]",
    text: "Example entry. One or two sentences about what you did and why it mattered to you, not how it looked on a CV.",
  },
  {
    period: "[Now]",
    title: "[Where you are heading]",
    text: "Example entry. What you're studying now and what you want to build next. This line is allowed to be uncertain.",
  },
];

export const contact = {
  heading: "Say hello",
  text: "Open to projects, collaboration, and a good conversation about anything technical.",
  email: "[Your email]",
  links: [
    { label: "GitHub", value: "[GitHub URL]" },
    { label: "Discord", value: "[Discord handle]" },
  ],
};

export const footer = {
  note: "Built by hand. Content lives in one file: src/content/site.ts.",
};
