import type { SiteContent } from "../site";

/**
 * English copy. Keep this file aligned with vi.ts: same structure, same
 * placeholder slots. Replace bracketed values with your real info.
 */
export const en: SiteContent = {
  docTitle: "Khánh · Student, Programmer, Creator",
  docDescription:
    "Personal site of Khánh: student, programmer, creator. Projects, interests, and the journey so far.",
  person: {
    name: "Khánh",
    role: "Student · Programmer · Creator",
    tagline: "Curious about technology. Driven to build things.",
    intro:
      "I like exploring ideas, solving problems, and turning what I learn into real projects.",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Journey", href: "#journey" },
    { label: "Contact", href: "#contact" },
  ],
  about: {
    lead: "I'm a student who loves programming, technology, and creative experiments. I learn by building — and by seeing how an idea behaves in the real world.",
    body: [
      "Most of what I know comes from taking something apart and putting it back together. A session introduces the idea; a project forces me to understand it.",
      "Right now I'm learning how to make software that feels good to use, not just software that runs. That means a lot of small experiments: a weekend game engine, a tool I needed at 2 a.m., a simulation for something I was wondering about.",
    ],
    learning:
      "Currently learning: game development and how machine-learning models actually work under the hood.",
  },
  projects: [
    {
      name: "[Project name]",
      year: "[Year]",
      summary: "A short description of what this project does and the problem it explores.",
      detail:
        "Sample text. Replace with two or three sentences: what the project does, what problem it explores, and how it was built. What was hard, what you learned, and what you'd change next time.",
      stack: ["[Technology]", "[Technology]", "[Technology]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "[Live Demo URL]",
      featured: true,
      image: null,
      imageCaption: "Place a [project screenshot] here",
    },
    {
      name: "[Project name]",
      year: "[Year]",
      summary: "Another example. A tool, a game, an experiment: anything you've actually made.",
      detail:
        "Sample text. Describe the second project the same way: the idea behind it, how it works, and what you took away from building it.",
      stack: ["[Technology]", "[Technology]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "[Live Demo URL]",
      featured: false,
      image: null,
      imageCaption: "Place a [project screenshot] here",
    },
    {
      name: "[Project name]",
      year: "[Year]",
      summary: "A third slot so the page looks complete before your real projects land here.",
      detail:
        "Sample text. Use this entry for a small experiment or a class assignment. Short and honest beats long and flashy.",
      stack: ["[Technology]", "[Technology]"],
      githubUrl: "[GitHub URL]",
      demoUrl: "",
      featured: false,
      image: null,
      imageCaption: "Place a [project screenshot] here",
    },
  ],
  interests: [
    {
      name: "Programming",
      note: "Writing small tools and seeing where they end up.",
    },
    {
      name: "Competitive programming",
      note: "Problems with time limits and one clearly right answer.",
    },
    {
      name: "AI experiments",
      note: "Poking at models to see how they behave, not just what they say.",
    },
    {
      name: "Minecraft",
      note: "Redstone is programming in a different font.",
    },
    {
      name: "Creative projects",
      note: "Anything that lives in the seam between code and design.",
    },
  ],
  skillGroups: [
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
  ],
  journey: [
    {
      period: "[Year]",
      title: "[First line of code]",
      text: "Sample text. Write about the moment you got hooked: the first program that ran, the first game mod that worked, the first problem you solved on your own.",
    },
    {
      period: "[Year]",
      title: "[A project or exam worth remembering]",
      text: "Sample text. One or two sentences about what you did and why it mattered to you, not how it would read on a CV.",
    },
    {
      period: "[Present]",
      title: "[Where you're headed]",
      text: "Sample text. What you're learning now and what you want to build next. This line is allowed to be uncertain.",
    },
  ],
  contact: {
    heading: "Say hello",
    text: "Open to projects, collaboration, and a good conversation about anything technical.",
    email: "[Your email]",
    links: [
      { label: "GitHub", value: "[GitHub URL]" },
      { label: "Discord", value: "[Discord handle]" },
    ],
  },
  footer: {
    note: "Made by hand. The copy lives in src/content/lang/vi.ts and en.ts.",
  },
  ui: {
    skipToContent: "Skip to content",
    mainNav: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    seeProjects: "See the projects",
    contactCta: "Contact",
    backToTop: "Back to top",
    aboutTitle: "About",
    projectsTitle: "Projects",
    projectsSub:
      "Sample entries below, in brackets until real work lands here. Each one is a slot to fill, not a claim.",
    interestsTitle: "Things I spend time on",
    skillsTitle: "Tools I work with",
    skillsSub:
      "A list, not a chart. Order within a group says nothing except that it reads better this way.",
    journeyTitle: "The journey so far",
    journeySub:
      "Example milestones. Every date and event here is yours to overwrite.",
    technologies: "Technologies",
    code: "Code",
    liveDemo: "Live demo",
    emailLabel: "Email",
    screenshotAlt: "Screenshot of {name}",
    pendingUrlHint: "Add the real URL in src/content/lang (vi.ts / en.ts)",
    pendingEmailHint: "Add your real email in src/content/lang (vi.ts / en.ts)",
    portraitPlaceholder: "[Your portrait]",
    portraitNoteBefore: "Drop a photo at ",
    portraitNotePath: "public/images/portrait.jpg",
    portraitNoteAfter:
      " and point the Hero component at it. Until then this frame stays honest.",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    switchLanguage: "Switch language",
  },
};
