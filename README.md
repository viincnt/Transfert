<div align="center">

# 📦 Transfert

> A privacy-focused file utility for converting formats, removing metadata, and preparing files for sharing — from the public website to the desktop application.

<img alt="workspace" src="https://img.shields.io/badge/workspace-pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white&labelColor=171717" />
<img alt="website" src="https://img.shields.io/badge/website-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=171717" />
<img alt="desktop" src="https://img.shields.io/badge/desktop-Rust-CE422B?style=for-the-badge&logo=rust&logoColor=white&labelColor=171717" />
<img alt="status" src="https://img.shields.io/badge/status-early%20development-76B900?style=for-the-badge&labelColor=171717" />

</div>

---

## 📌 Overview

**Transfert** is a desktop-first file utility project. Its goal is to make common file-preparation tasks straightforward and privacy-conscious: convert files between formats, inspect or remove embedded metadata, and export files ready to share, publish, or archive.

The repository is a monorepo using `pnpm workspaces` and is structured to host two products that work together:

- The **website**, built with Next.js, is the public home of the project.
- The **desktop application**, built natively in Rust, will handle local file conversion and metadata-cleaning workflows.

The desktop application is intended to process files locally, avoiding unnecessary uploads and keeping users in control of their data.

---

## ✨ What the desktop application will cover

- File conversion across supported image, document, audio, video, and archive formats.
- Metadata inspection and removal, including EXIF data, author information, location data, and embedded file properties.
- Batch operations for applying one action to many files at once.
- Export presets for common sharing and publishing workflows.
- Local-first processing, designed to keep files on the user's device.

The exact list of supported formats and operations will evolve as the desktop application is implemented.

---

## 🗂️ Structure

```text
.
├── apps/
│   ├── desktop/              # Future native Rust desktop application
│   └── website/              # Next.js website (src/app router)
│       ├── i18n/             # next-intl config and messages (en.json)
│       ├── public/
│       │   ├── brand/        # App icon assets
│       │   └── fonts/        # Inter Variable woff2
│       └── src/
│           └── app/
│               ├── components/   # Shared UI components
│               ├── lib/          # Data and utilities
│               ├── download/     # /download page
│               ├── privacy/      # /privacy page
│               └── terms/        # /terms page
├── package.json              # Workspace orchestration scripts
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

---

## 🧪 Development environment

- Package manager: `pnpm` 12
- Website: Next.js 16, React 19, and TypeScript
- Desktop: Rust (native, planned)
- Formatting: Prettier and `prettier-plugin-tailwindcss`

Install dependencies and start the website:

```sh
pnpm install
pnpm dev
```

The website will be available at http://localhost:3000.

Other useful commands:

```sh
pnpm build          # creates a production build for all workspaces
pnpm lint           # runs linting in workspace packages where available
pnpm format:check   # checks formatting
pnpm format         # applies formatting
```

To run only the website, use the workspace filter:

```sh
pnpm --filter @transfert/website dev
```

---

## 🗺️ Project direction

**Currently in development:**

1. Public website built with Next.js.
2. Monorepo foundation and shared development tooling.

**Planned for the monorepo:**

1. Native Rust desktop application for local file conversion.
2. Metadata inspection and removal tools.
3. Batch processing and export presets.
4. Support for additional file types and processing workflows.

The next stages will be defined as the desktop product takes shape.

---

## 📄 Licenses

- The future desktop application in [`apps/desktop`](./apps/desktop) is dual-licensed under [MIT](./apps/desktop/LICENSE-MIT) or [Apache-2.0](./apps/desktop/LICENSE-APACHE), at your option.
- The website in [`apps/website`](./apps/website) is proprietary. See [its license](./apps/website/LICENSE).
