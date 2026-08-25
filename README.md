<div align="center">

# <img src="apps/desktop/src-tauri/icons/icon.png" alt="" width="32" height="32" align="center" /> Transfert

> Your computer can already do most of this. So let it.

<img alt="platform" src="https://img.shields.io/badge/platform-Windows-3f3f46?style=for-the-badge&logo=windows&logoColor=white&labelColor=18181b" />
<img alt="status" src="https://img.shields.io/badge/status-early%20development-3f3f46?style=for-the-badge&labelColor=18181b" />
<a href="#-license">
  <img alt="license" src="https://img.shields.io/badge/license-GPL--3.0-3f3f46?style=for-the-badge&labelColor=18181b" />
</a>

</div>

---

**Transfert** is a local-first file toolbox: conversion, compression and
cleanup tools that run entirely on your machine — no upload, no account, no
telemetry. Full pitch, download and docs **[Here](https://usetransfert.vercel.app)!**.

This is a pnpm monorepo with two apps:

| App                            | What                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| [`apps/desktop`](apps/desktop) | The Tauri + React desktop app — this is the actual product.                         |
| [`apps/web`](apps/web)         | The marketing site + docs, built with Next.js and [Fumadocs](https://fumadocs.dev). |

## Quick start

```bash
pnpm install
pnpm dev:desktop   # the desktop app (Tauri)
pnpm dev:web       # the website
```

See each app's own README for details: [apps/desktop](apps/desktop/README.md),
[apps/web](apps/web/README.md).

## Docs

User-facing documentation (installation, tools, privacy) lives in
[apps/web/content/docs](apps/web/content/docs) and is published on the
website's `/docs` section.

## License

Distributed under the [GNU General Public License v3.0](LICENSE). See
[PRIVACY.md](PRIVACY.md) for the privacy policy.
