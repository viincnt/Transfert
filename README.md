<div align="center">

# <img src="apps/desktop/src-tauri/icons/icon.png" alt="Transfert logo" width="32" height="32" align="center" /> Transfert

> Your files stay with you.

<img alt="desktop: Tauri" src="https://img.shields.io/badge/desktop-Tauri-e5eee5?style=for-the-badge&logo=tauri&logoColor=white&labelColor=000000" />
<img alt="privacy: local only" src="https://img.shields.io/badge/privacy-local_only-e5eee5?style=for-the-badge&logo=privacyguides&logoColor=white&labelColor=000000" />
<a href="https://github.com/viincnt/Transfert/blob/main/LICENSE"><img alt="license: GPL-3.0" src="https://img.shields.io/badge/license-GPL--3.0-e5eee5?style=for-the-badge&logo=gnu&logoColor=white&labelColor=000000" /></a>

</div>

## Local-first file tools

**Transfert** is a desktop toolbox for converting and cleaning files on your
own machine. No file uploads, accounts, analytics, crash reporting, telemetry,
or tracking.

The desktop toolbox includes:

- Image conversion and optimization using Rust libraries.
- Metadata removal for JPG, PNG, TIFF, and supported WebP files.
- Metadata editing for common image fields.

The current development tree expands image output to 15 formats and adds
TXT/Markdown/HTML conversion plus a **libVLC 3 audio/video integration**.
Audio output options include MP3, OGG, Opus, FLAC, M4A/AAC and WAV. Media
conversion is still being validated; see the [desktop README](apps/desktop/README.md)
for the supported formats, runtime requirements and automated tests.

## Built with VideoLAN's libVLC

The media engine is **libVLC, by VideoLAN and its contributors**. Transfert
provides the Rust integration and interface; libVLC and its native codec plugins
are third-party software, not code authored by Transfert. Processing stays on
your machine. Some plugins use FFmpeg internally.

LibVLC is LGPL-2.1-or-later; bundled plugins and dependencies have their own
licenses, including GPL licenses. See [third-party notices](THIRD_PARTY_NOTICES.md)
and [VideoLAN's legal information](https://www.videolan.org/legal.html) for
attribution, source links and redistribution terms. Transfert is independent
and is not affiliated with or endorsed by VideoLAN.

## Project structure

| Path                           | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| [`apps/desktop`](apps/desktop) | The Tauri + React desktop application.         |
| [`apps/web`](apps/web)         | The Next.js marketing site and privacy policy. |

## Development

### Requirements

- Node.js 22 or later
- [pnpm](https://pnpm.io)
- Rust stable via [rustup](https://rustup.rs) for the desktop application
- MSVC Build Tools on Windows, as required by [Tauri](https://tauri.app/start/prerequisites/)
- LibVLC 3 and its plugins for audio/video development and integration tests

### Run locally

```bash
pnpm install

# Desktop application
pnpm dev:desktop

# Marketing website
pnpm dev:web
```

### Production builds

```bash
pnpm build:desktop
pnpm build:web

# Desktop installer including the staged LibVLC runtime
pnpm --filter desktop bundle
```

## Releases

Push a version tag after setting the same version in
`apps/desktop/package.json`, `apps/desktop/src-tauri/tauri.conf.json`, and
`apps/desktop/src-tauri/Cargo.toml`:

```bash
git tag v0.2.0
git push origin v0.2.0
```

GitHub Actions runs frontend, Rust and real-codec tests, stages the LibVLC runtime,
and builds a Windows MSI and a macOS DMG before publishing a release. Media test
failures block the build. The app supports optional automatic update checks and
manual checks from About.

## Tests

```bash
pnpm --filter desktop test
pnpm --filter desktop test:rust
pnpm --filter desktop test:media
```

The media suite requires a LibVLC 3 runtime and exercises actual encoding and
decoding, rather than mocking the native codecs. Audio is currently available
as an experimental feature: a separate regression test tracks end-of-file sample
loss observed in the bundled LibVLC 3 runtime.

## Privacy

Transfert processes files locally. Read the full [privacy policy](PRIVACY.md),
or view it on the website at `/privacy`.

## License

Distributed under the [GNU General Public License v3.0](LICENSE).
