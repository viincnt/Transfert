# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-08-13

### Added

- Image converter: `PNG`, `JPG`, `WEBP`, `GIF`, `BMP`, `TIFF`, `AVIF`, `ICO`, `SVG` — drag-and-drop or file picker, batch conversion, optional zip bundling, and custom output naming with token support.
- Every conversion is verified after writing: the output is re-read and re-hashed, and (AVIF aside) re-decoded and compared against what was requested, before it's ever reported back as successful.
- Toolbox layout with placeholders for document/audio/video conversion, PDF tools, OCR and metadata editing — not implemented yet.
- App icon, in both the flat badge style used inside the app and a macOS-ready squircle source for the packaged app icon.
- Windows packaging via MSI, as the source artifact for eventual Microsoft Store (MSIX) submission.

[unreleased]: https://gitlab.com/viincnt/transfert/-/compare/v0.1.0...main
[0.1.0]: https://gitlab.com/viincnt/transfert/-/tags/v0.1.0
