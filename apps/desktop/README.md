# Transfert desktop

The local-first desktop application for Transfert, built with Tauri, React, and
TypeScript. The application runs conversions and metadata tools on the user's
machine without uploading files or collecting usage data.

See the [root README](../../README.md) for the product overview and
[PRIVACY.md](../../PRIVACY.md) for the privacy policy.

## Development

Requirements: Node.js 22+, [pnpm](https://pnpm.io), and Rust stable via
[rustup](https://rustup.rs). Windows builds also require the MSVC Build Tools;
see Tauri's [prerequisites guide](https://tauri.app/start/prerequisites/).

From the repository root:

```bash
pnpm install
pnpm dev:desktop
```

Or run the Tauri application directly from this directory:

```bash
pnpm tauri dev
```

## Build

```bash
pnpm --filter desktop build
```

To create a Windows installer:

```bash
pnpm --filter desktop tauri build --bundles msi
```

The MSI is produced under `src-tauri/target/release/bundle/msi/`.

## Updates

Transfert updates itself from signed GitHub Release artifacts. Users receive the
update inside the app; they do not need to download a new installer manually.

To publish an update, set the same version in `package.json`,
`src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`, then push a matching
`v<version>` tag. The GitHub Actions workflow creates the signed installers and
its `latest.json` updater manifest automatically.

The signing key must remain available in the `TAURI_SIGNING_PRIVATE_KEY` GitHub
Actions secret. The local backup is stored at `~/.tauri/transfert.key`; losing
both copies prevents new releases from updating existing installations.

## Conversion engines

- Images: Rust `image` and `resvg`. Outputs: PNG, JPG, WEBP, GIF, BMP,
  TIFF, AVIF, ICO, SVG (embedded raster), QOI, TGA, PNM, HDR, EXR and
  farbfeld. AVIF is currently output-only; animated inputs use their first frame.
- Documents: UTF-8 TXT, Markdown and HTML, using Rust parsers. These are
  text-oriented conversions, not a PDF/DOCX layout engine.
- Audio/video: Rust integration with the **LibVLC 3.x C API**. No VLC subprocess
  or shell is used. LibVLC and its codec plugins are native libraries (some
  plugins use FFmpeg internally); this part is not pure Rust.
- Audio outputs: WAV, FLAC, MP3, OGG/Vorbis, Opus, M4A/AAC.
- Video outputs: MP4/MOV (H.264/AAC), WebM (VP8/Vorbis), OGV
  (Theora/Vorbis), TS (MPEG-2/MPGA), AVI (MPEG-4/MP3).

Transcoding uses fixed presets and does not preserve subtitles, chapters or
metadata. Inputs must contain the requested audio/video track. Missing codecs,
corrupt media and incomplete outputs produce errors rather than a successful
download. Conversion is limited to two hours per file.

**Audio conversion is experimental:** a native regression test detects that the
current LibVLC 3 runtime can trim audio at the end of some files. The app still
verifies that the expected track exists and output is non-empty, but it cannot
reliably detect this sample-level loss for every source/codec combination. Keep
the original file and inspect converted audio. This regression is tracked in CI
without blocking the experimental feature's installer build.

LibVLC is developed by **VideoLAN and its contributors**; Transfert does not
claim authorship of the media engine or its codecs. LibVLC uses LGPL-2.1-or-later;
plugins and dependencies have their own licenses, including GPL licenses.
See [third-party notices](../../THIRD_PARTY_NOTICES.md),
[VideoLAN's legal information](https://www.videolan.org/legal.html) and the
[upstream source](https://code.videolan.org/videolan/vlc). Transfert is independent
and is not affiliated with or endorsed by VideoLAN.

### Portable media builds

Install VLC 3 for the build machine's architecture, or set `TRANSFERT_VLC_DIR`
to the directory containing `libvlc.dll` (Windows) or `libvlc.dylib` (macOS).
For development, the standard VLC installation is also detected automatically.

```bash
pnpm --filter desktop bundle
```

This stages the libraries, plugins and license into an ignored resource directory
and includes them in the installer. The end user does not need VLC installed.
CI tests the staged runtime before building. The normal `tauri build` command
without `tauri.vlc.conf.json` does not embed VLC. Linux currently uses the system
`libvlc.so.5` and plugins; portable Linux packaging is not configured.

## Automated tests

```bash
pnpm --filter desktop test
pnpm --filter desktop test:rust
pnpm --filter desktop test:media
pnpm --filter desktop test:media:regression
```

The first command tests the real dropdown components, alias handling, mixed
batches, destination cancellation, ZIP failures and retry behavior with mocked
Tauri calls. Rust tests exercise real image encoders, text conversion, archive
contents and non-overwriting delivery. Media tests require LibVLC 3 with codecs:
they synthesize fixtures, transcode every advertised output and round-trip audio
back to WAV. A separate Symphonia decoder tracks the known lossless sample-loss
regression independently of libVLC. Both Windows and macOS jobs run the suites
before producing installers. Codec test failures are reported but do not block
the build while media conversion remains experimental.
