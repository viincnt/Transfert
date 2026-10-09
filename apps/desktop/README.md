# Transfert desktop

The local-first desktop application for Transfert, built with Tauri, React, and
TypeScript. The application runs conversions and metadata tools on the user's
machine without uploading files or collecting usage data.

See the [root README](../../README.md) for the product overview and
[PRIVACY.md](../../PRIVACY.md) for the privacy policy.

## Development

Requirements: Node.js 18+, [pnpm](https://pnpm.io), and Rust stable via
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
