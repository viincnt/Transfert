# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-08-24

### Added

- Strip Metadata: removes EXIF metadata from `JPG`, `PNG`, `TIFF` and lossless/extended `WEBP` files in place, without decoding/re-encoding the pixels. Batch, same naming controls as the image converter.
- Edit Metadata: view and edit the Author, Copyright, Description, Date taken and device Make/Model EXIF fields on a single image, then save a verified copy — the write is re-read and compared against what was requested before it's reported as successful.
- Window size and position are now remembered between launches.

### Changed

- Default window size increased from 800×600 to 1100×700.

### Fixed

- Tool cards on the home screen now visibly highlight on hover — they use a `ring` for their outline, not a `border`, so the hover style was changing a border color that was never actually drawn.

## [0.1.1] - 2026-08-14

### Fixed

- Windows MSI now installs per-user (to `%LOCALAPPDATA%`) instead of per-machine (`Program Files`), so installation no longer needs an admin prompt. The per-machine install was silently requiring UAC elevation, which fails Microsoft Store's requirement that unpackaged app installers run fully silently.

## [0.1.0] - 2026-08-13

### Added

- Image converter: `PNG`, `JPG`, `WEBP`, `GIF`, `BMP`, `TIFF`, `AVIF`, `ICO`, `SVG` — drag-and-drop or file picker, batch conversion, optional zip bundling, and custom output naming with token support.
- Every conversion is verified after writing: the output is re-read and re-hashed, and (AVIF aside) re-decoded and compared against what was requested, before it's ever reported back as successful.
- Toolbox layout with placeholders for document/audio/video conversion, PDF tools, OCR and metadata editing — not implemented yet.
- App icon, in both the flat badge style used inside the app and a macOS-ready squircle source for the packaged app icon.
- Windows packaging via MSI, as the source artifact for eventual Microsoft Store (MSIX) submission.

[unreleased]: https://github.com/viincnt/Transfert/compare/v0.2.0...main
[0.2.0]: https://github.com/viincnt/Transfert/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/viincnt/Transfert/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/viincnt/Transfert/tags/v0.1.0
