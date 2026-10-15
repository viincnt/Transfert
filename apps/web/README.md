# Transfert website

The marketing site for Transfert, built with [Next.js](https://nextjs.org),
Tailwind CSS, and Motion. It contains the landing page and the public privacy
policy and open-source credits. The media-engine attribution identifies
VideoLAN/libVLC as third-party software, with source and license links.

## Development

From the repository root:

```bash
pnpm install
pnpm dev:web
```

Or from this directory:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm --filter web build
```

## Structure

| Path                              | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `src/app/(home)/page.tsx`         | Landing page.                                   |
| `src/app/(home)/privacy/page.tsx` | Public privacy policy.                          |
| `src/app/(home)/credits/page.tsx` | VideoLAN/libVLC and open-source credits.        |
| `src/components`                  | Navigation, motion, and shared site components. |
| `public`                          | Product screenshots used by the landing page.   |

The site is deployed on Vercel with `apps/web` as its root directory.

Keep the public privacy page aligned with [`PRIVACY.md`](../../PRIVACY.md), and
the credits aligned with [`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)
and the desktop About page. Media conversion runs locally through libVLC and
its native plugins; it is not a VideoLAN-hosted service or a pure-Rust codec stack.
