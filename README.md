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

The first release includes:

- Image conversion between PNG, JPG, WebP, GIF, BMP, TIFF, AVIF, ICO, and SVG.
- Metadata removal for JPG, PNG, TIFF, and supported WebP files.
- Metadata editing for common image fields.

The project is in early development. More file tools are planned, but every one
will follow the same local-first approach.

## Project structure

| Path                           | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| [`apps/desktop`](apps/desktop) | The Tauri + React desktop application.         |
| [`apps/web`](apps/web)         | The Next.js marketing site and privacy policy. |

## Development

### Requirements

- Node.js 18 or later
- [pnpm](https://pnpm.io)
- Rust stable via [rustup](https://rustup.rs) for the desktop application
- MSVC Build Tools on Windows, as required by [Tauri](https://tauri.app/start/prerequisites/)

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
```

## Releases

Push a version tag after setting the same version in
`apps/desktop/package.json`, `apps/desktop/src-tauri/tauri.conf.json`, and
`apps/desktop/src-tauri/Cargo.toml`:

```bash
git tag v0.2.0
git push origin v0.2.0
```

GitHub Actions builds a Windows MSI and a macOS DMG, then attaches both to the
GitHub Release. The app's About page checks that release when the user chooses
to check for updates.

## Privacy

Transfert processes files locally. Read the full [privacy policy](PRIVACY.md),
or view it on the website at `/privacy`.

## License

Distributed under the [GNU General Public License v3.0](LICENSE).
