<div align="center">

# <img src="src-tauri/icons/icon.png" alt="" width="32" height="32" align="center" /> Transfert

> Your computer can already do most of this. So let it.

<img alt="platform" src="https://img.shields.io/badge/platform-Windows-3f3f46?style=for-the-badge&logo=windows&logoColor=white&labelColor=18181b" />
<img alt="status" src="https://img.shields.io/badge/status-early%20development-3f3f46?style=for-the-badge&labelColor=18181b" />
<a href="#-license">
  <img alt="license" src="https://img.shields.io/badge/license-GPL--3.0-3f3f46?style=for-the-badge&labelColor=18181b" />
</a>

<!-- Screenshot pending. -->

</div>

---

## 📌 Overview

**Transfert** is a local-first file toolbox: conversion, compression and cleanup tools that run entirely on your machine. Nothing is uploaded anywhere to get a file converted — no server round-trip, no account, no telemetry. If your computer can already do the job, Transfert just gives it a decent interface for doing it.

Every conversion decodes, re-encodes and then **verifies its own output** before handing it back — writes get re-read and re-hashed, encodes get re-decoded and compared — so a corrupted or truncated result is caught and discarded instead of silently landing in your folder.

---

## 🧰 Tools

| Category | Tool | Status |
|---|---|---|
| File Converter | Image | ✅ Available |
| File Converter | Document | 🔜 Planned |
| File Converter | Audio | 🔜 Planned |
| File Converter | Video | 🔜 Planned |
| PDF Tools | Merge & Split | 🔜 Planned |
| PDF Tools | Compress | 🔜 Planned |
| PDF Tools | Edit & Annotate | 🔜 Planned |
| OCR | Image → Text | 🔜 Planned |
| OCR | PDF → Text | 🔜 Planned |
| Metadata | Strip | 🔜 Planned |
| Metadata | Edit | 🔜 Planned |

**Image Converter** — converts between `PNG`, `JPG`, `WEBP`, `GIF`, `BMP`, `TIFF`, `AVIF`, `ICO` and `SVG` (SVG output wraps the raster image in an SVG document rather than tracing it into vector paths — the same thing most "convert to SVG" tools do for photos). Drag-and-drop or file picker, batch conversion, optional zip bundling, and custom output naming with token support.

---

## 🧩 Requirements

**To run the packaged app:** Windows 10 (1809+) or Windows 11, x64. Needs the WebView2 Runtime — already on Windows 11 and most up-to-date Windows 10 machines; the installer pulls it automatically if it's missing.

macOS support is in progress — the app icon and `.icns` bundle asset already exist (`src-tauri/icons/`), but no macOS build target is wired up yet.

**To build from source:** Node.js 18+, [pnpm](https://pnpm.io), and the Rust stable toolchain (via [rustup](https://rustup.rs)). On Windows you'll also need the MSVC build tools (Tauri's own setup guide covers this: [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites)).

---

## 🚀 Installation

**Windows** — one-liner, no admin rights needed (the MSI installs per-user):

```powershell
irm https://gitlab.com/viincnt/transfert/-/raw/main/scripts/install.ps1 | iex
```

Downloads whatever the [latest release](https://gitlab.com/viincnt/transfert/-/releases/permalink/latest) is and installs it silently. To grab the `.msi` by hand instead, it's on that same release page.

**Microsoft Store** — submitted, awaiting review.

**macOS / Linux** — not packaged yet. `install.ps1` gets siblings once those targets exist.

**From source:**

```bash
git clone https://gitlab.com/viincnt/transfert.git
cd transfert
pnpm install
pnpm tauri dev
```

---

## 📦 Packaging

```bash
pnpm tauri build --bundles msi
```

Produces `src-tauri/target/release/bundle/msi/Transfert_<version>_x64_en-US.msi` — installs per-user, no elevation (see [src-tauri/wix/main.wxs](src-tauri/wix/main.wxs), a custom WiX template; Tauri's own default installs per-machine and needs admin).

Pushing a version tag (`vX.Y.Z`) runs this on a self-hosted runner via [.gitlab-ci.yml](.gitlab-ci.yml), publishes the MSI to this project's package registry, and creates a GitLab Release pointing at it — that's the same MSI both `install.ps1` and the Microsoft Store submission use.

---

## 📄 License

Distributed under the [GNU General Public License v3.0](LICENSE).

Built with Tauri, React and a handful of Rust crates for the actual conversion work — the full list, with individual licenses, is in the app itself under **Settings → About**.
