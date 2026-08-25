# Transfert — website

The marketing site + docs, built with [Next.js](https://nextjs.org) and
[Fumadocs](https://fumadocs.dev). Home page (`src/app/(home)`) is the landing
page; `/docs` (content in [`content/docs`](content/docs)) is the
documentation.

From the repo root:

```bash
pnpm install
pnpm dev:web
```

Or from this directory directly:

```bash
cd apps/web
pnpm dev
```

Open http://localhost:3000.

## Structure

| Path                       | What                                          |
| --------------------------- | ---------------------------------------------- |
| `src/app/(home)`            | Landing page and its layout.                   |
| `src/app/docs`              | Docs layout and page renderer.                 |
| `content/docs`              | The actual documentation, as MDX.              |
| `src/lib/source.ts`         | Content source adapter (Fumadocs' `loader()`). |
| `src/lib/shared.ts`         | App name, repo links — edit here to rebrand.   |
| `src/lib/layout.shared.tsx` | Shared nav/layout options for both layouts.    |

Adding a new top-level tab (e.g. a blog) is a new route under `src/app/` plus
an entry in `baseOptions().nav`/`links` in `src/lib/layout.shared.tsx` — no
other structural change needed.

Deployed on Vercel with **Root Directory** set to `apps/web`.
