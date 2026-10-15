import {
  Atom,
  AppWindow,
  Blocks,
  Component,
  Feather,
  Languages,
  Maximize2,
  Route,
  Tags,
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
    name: "LibVLC / VideoLAN",
    description: "Native audio/video conversion engine and codec plugins",
    license: "LGPL-2.1+",
    url: "https://www.videolan.org/vlc/libvlc.html",
    icon: Blocks,
  },
  {
    name: "pulldown-cmark",
    description: "Markdown parsing and HTML generation in Rust",
    license: "MIT",
    url: "https://github.com/pulldown-cmark/pulldown-cmark",
    icon: Type,
  },
  {
    name: "html2text",
    description: "HTML to text conversion in Rust",
    license: "MIT",
    url: "https://crates.io/crates/html2text",
    icon: Type,
  },
  {
    name: "html2md",
    description: "HTML to Markdown conversion in Rust",
    license: "MIT",
    url: "https://crates.io/crates/html2md",
    icon: Type,
  },
  {
    name: "image",
    description: "Raster image decoding and encoding",
    license: "MIT / Apache-2.0",
    url: "https://github.com/image-rs/image",
    icon: Blocks,
  },
  {
    name: "resvg",
    description: "SVG rasterization in Rust",
    license: "MPL-2.0",
    url: "https://github.com/linebender/resvg",
    icon: Blocks,
  },
  {
    name: "libloading",
    description: "Runtime loading of the native LibVLC library",
    license: "ISC",
    url: "https://github.com/nagisa/rust_libloading",
    icon: Blocks,
  },
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
  {
    name: "little_exif",
    description: "EXIF metadata read/write",
    license: "MIT / Apache-2.0",
    url: "https://github.com/TechnikTobi/little_exif",
    icon: Tags,
  },
  {
    name: "tauri-plugin-window-state",
    description: "Remembers window size & position",
    license: "MIT / Apache-2.0",
    url: "https://github.com/tauri-apps/plugins-workspace",
    icon: Maximize2,
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
