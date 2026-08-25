# Transfert (desktop)

The Tauri + React desktop app. See the [repo root README](../../README.md) for
the project overview, and [docs](../web/content/docs) for user-facing
documentation.

## Build from source

**Requirements:** Node.js 18+, [pnpm](https://pnpm.io), and the Rust stable
toolchain (via [rustup](https://rustup.rs)). On Windows you'll also need the
MSVC build tools (Tauri's own setup guide covers this:
[tauri.app/start/prerequisites](https://tauri.app/start/prerequisites)).

From the repo root:

```bash
pnpm install
pnpm dev:desktop
```

Or from this directory directly:

```bash
cd apps/desktop
pnpm tauri dev
```

## Packaging

```bash
pnpm --filter desktop tauri build --bundles msi
```

Produces `src-tauri/target/release/bundle/msi/Transfert_<version>_x64_en-US.msi`
— installs per-user, no elevation (see [src-tauri/wix/main.wxs](src-tauri/wix/main.wxs),
a custom WiX template; Tauri's own default installs per-machine and needs admin).

Pushing a version tag (`vX.Y.Z`) runs this on a self-hosted runner via
[../../.gitlab-ci.yml](../../.gitlab-ci.yml), publishes the MSI to this
project's package registry, and creates a GitLab Release pointing at it —
that's the same MSI both the direct `.msi` download and the Microsoft Store
listing use.
