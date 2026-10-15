# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.3.4] - 2026-10-15

### Added

- Signed in-app updates for Windows and macOS releases. Updates download,
  verify, install and restart from Transfert without requiring a manual GitHub
  download.

## [0.3.3] - 2026-10-15

### Fixed

- Windows MSI packaging now installs the bundled LibVLC runtime in Program Files, resolving WiX validation failures for its native plugin files.
- The Windows installer no longer downloads the WebView2 bootstrapper during installation.

## [0.3.2] - 2026-10-15

### Fixed

- macOS LibVLC staging now adds the runtime search path required to load `libvlccore.dylib` outside VLC.app.
- Experimental codec-test failures no longer block installer builds while the media engine is being stabilized.

## [0.3.1] - 2026-10-15

### Changed

- Moved the manual update check from About to Settings, next to the automatic-update preference.

### Fixed

- VLC runtime packaging no longer downloads license texts during CI builds; builds work without GNU.org access.

## [0.3.0] - 2026-10-15

### Added

- Document conversion for UTF-8 TXT, Markdown and HTML files.
- Experimental local audio conversion through libVLC: WAV, FLAC, MP3, OGG, Opus and M4A/AAC outputs.
- Local video conversion through libVLC: MP4, MOV, WebM, OGV, TS and AVI outputs.
- Additional image output formats: QOI, TGA, PNM, HDR, EXR and farbfeld.
- Audio/video runtime staging, codec integration tests and VideoLAN/libVLC attribution and license notices.

### Changed

- Input format lists now only show formats that are available as outputs; aliases such as JPEG/JPG and TIFF/TIF are accepted without duplicate entries.
- Output format pickers use a three-column grid and disable the source format per file.

### Known issues

- Audio conversion is experimental. The bundled LibVLC 3 runtime can trim audio at the end of some files; retain the original and inspect converted audio.

## [0.2.1] - 2026-10-11

### Added

- Image Optimizer: resize and re-encode images to reduce file size.
- Optional update checks against the latest public GitHub Release. They can be disabled in Settings to keep Transfert fully offline.
- Direct Windows MSI and macOS DMG downloads.

### Fixed

- macOS DMG bundling no longer depends on compiling the macOS icon asset catalog.

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

[unreleased]: https://github.com/viincnt/Transfert/compare/v0.3.4...main
[0.3.4]: https://github.com/viincnt/Transfert/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/viincnt/Transfert/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/viincnt/Transfert/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/viincnt/Transfert/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/viincnt/Transfert/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/viincnt/Transfert/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/viincnt/Transfert/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/viincnt/Transfert/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/viincnt/Transfert/tags/v0.1.0
