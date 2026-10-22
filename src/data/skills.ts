export type Skill = { id: string; label: string; role: string; used: string; with?: string[] };
export type Branch = { id: string; label: string; blurb: string; skills: Skill[] };

export const branches: Branch[] = [
  {
    id: "web",
    label: "Web fundamentals",
    blurb: "The building blocks of the web.",
    skills: [
      {
        id: "html",
        label: "HTML",
        role: "Page structure and accessibility.",
        used: "Structures the sections, headings, links, and interactive elements across the website.",
        with: ["css", "js"]
      },
      {
        id: "css",
        label: "CSS",
        role: "Layouts, styling, and visual details.",
        used: "Controls layouts, colours, typography, responsive styling, and custom animations.",
        with: ["html", "tailwind"]
      },
      {
        id: "js",
        label: "JavaScript",
        role: "Logic and interactivity.",
        used: "Powers the rain effect, theme controls, interactive gallery, and other website features.",
        with: ["ts", "canvas", "webapis"]
      },
      {
        id: "webapis",
        label: "Web APIs",
        role: "Working with built-in browser features.",
        used: "Handles scroll detection, layout changes, network requests, and other browser interactions.",
        with: ["js", "canvas"]
      },
    ]
  },
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Building interactive interfaces.",
    skills: [
      {
        id: "react",
        label: "React",
        role: "Components and interface state.",
        used: "Powers the website's sections, interactive controls, gallery, and chess replay.",
        with: ["ts", "motion", "tailwind", "vite"]
      },
      {
        id: "ts",
        label: "TypeScript",
        role: "Types for data and components.",
        used: "Keeps component props, content data, and application logic consistently typed.",
        with: ["react", "js"]
      },
    ]
  },
  {
    id: "style",
    label: "Styling",
    blurb: "A consistent look across the website.",
    skills: [
      {
        id: "tailwind",
        label: "Tailwind CSS",
        role: "Utility-based styling.",
        used: "Handles much of the layout and component styling, with shared values for colours and other design choices.",
        with: ["css", "react"]
      },
    ]
  },
  {
    id: "motion",
    label: "Motion",
    blurb: "Smooth, responsive interactions.",
    skills: [
      {
        id: "motion",
        label: "Motion",
        role: "Animations for React.",
        used: "Animates section reveals, navigation, gallery transitions, and other interface interactions.",
        with: ["react", "css"]
      },
      {
        id: "canvas",
        label: "Canvas 2D",
        role: "Drawing graphics with code.",
        used: "Renders the animated rain, including falling drops, splashes, and pointer-driven wind.",
        with: ["js", "webapis"]
      },
    ]
  },
  {
    id: "tools",
    label: "Tooling",
    blurb: "Developing, building, and shipping the site.",
    skills: [
      {
        id: "vite",
        label: "Vite",
        role: "Development server and build tool.",
        used: "Runs the local development server and builds the production files for deployment.",
        with: ["react", "ts", "node"]
      },
      {
        id: "git",
        label: "Git & GitHub",
        role: "Version control and hosting.",
        used: "Tracks code changes, stores the project repository, and hosts the website through GitHub Pages.",
        with: ["vite"]
      },
      {
        id: "node",
        label: "Node.js",
        role: "Runtime for development tools.",
        used: "Runs the development scripts, package tooling, and build processes used by the project.",
        with: ["vite"]
      },
    ]
  },
  {
    id: "design",
    label: "Design",
    blurb: "Visuals with purpose and personality.",
    skills: [
      {
        id: "gd",
        label: "Graphic design",
        role: "Composition, typography, and colour.",
        used: "Shapes the YouTube thumbnails and the visual direction of the website.",
        with: ["tailwind", "motion"]
      },
    ]
  },
];
