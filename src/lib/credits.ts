import {
  Atom,
  AppWindow,
  Blocks,
  Component,
  Feather,
  Languages,
  Route,
  Type,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type Credit = {
  name: string;
  description: string;
  license: string;
  url: string;
  icon: LucideIcon;
};

// Open source projects Transfert is built on. Add to this list whenever a
// new dependency (frontend, or a Rust crate/CLI in the conversion pipeline)
// is introduced.
export const credits: Credit[] = [
  {
    name: "Tauri",
    description: "Native app shell",
    license: "MIT / Apache-2.0",
    url: "https://tauri.app",
    icon: AppWindow,
  },
  {
    name: "React",
    description: "UI library",
    license: "MIT",
    url: "https://react.dev",
    icon: Atom,
  },
  {
    name: "Vite",
    description: "Build tool",
    license: "MIT",
    url: "https://vite.dev",
    icon: Zap,
  },
  {
    name: "Tailwind CSS",
    description: "Styling",
    license: "MIT",
    url: "https://tailwindcss.com",
    icon: Wind,
  },
  {
    name: "shadcn/ui",
    description: "Component design system",
    license: "MIT",
    url: "https://ui.shadcn.com",
    icon: Component,
  },
  {
    name: "Radix UI",
    description: "Accessible primitives",
    license: "MIT",
    url: "https://www.radix-ui.com",
    icon: Blocks,
  },
  {
    name: "Lucide",
    description: "Icon set",
    license: "ISC",
    url: "https://lucide.dev",
    icon: Feather,
  },
  {
    name: "React Router",
    description: "Client-side routing",
    license: "MIT",
    url: "https://reactrouter.com",
    icon: Route,
  },
  {
    name: "i18next",
    description: "Localization",
    license: "MIT",
    url: "https://www.i18next.com",
    icon: Languages,
  },
  {
    name: "Geist",
    description: "Typeface",
    license: "OFL-1.1",
    url: "https://vercel.com/font",
    icon: Type,
  },
];

export type Contributor = {
  name: string;
  role: string;
  url: string;
};

export const contributors: Contributor[] = [
  {
    name: "Vincent",
    role: "Creator & maintainer",
    url: "https://viincnt.com",
  },
];
