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

**Microsoft Store** — pending. The app builds as an MSI today; Store submission needs that MSI converted to MSIX via Microsoft's MSIX Packaging Tool and certified through Partner Center.

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

Produces `src-tauri/target/release/bundle/msi/transfert_<version>_x64_en-US.msi`. That's also the artifact the Microsoft Store submission starts from — see [Installation](#-installation).

---

## 📄 License

Distributed under the [GNU General Public License v3.0](LICENSE).

Built with Tauri, React and a handful of Rust crates for the actual conversion work — the full list, with individual licenses, is in the app itself under **Settings → About**.
