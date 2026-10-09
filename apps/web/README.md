# Transfert website

The marketing site for Transfert, built with [Next.js](https://nextjs.org),
Tailwind CSS, and Motion. It contains the landing page and the public privacy
policy; product documentation is no longer maintained in this application.

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
| `src/components`                  | Navigation, motion, and shared site components. |
| `public`                          | Product screenshots used by the landing page.   |

The site is deployed on Vercel with `apps/web` as its root directory.
