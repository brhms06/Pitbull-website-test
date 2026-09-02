# Ironline Bullies

An American Bully puppy breeder website — Next.js (App Router) + TypeScript + Tailwind CSS + Supabase, deployed on Vercel.

## Tech stack

- **Next.js 15** (App Router) — pages, layouts, SSR, `generateMetadata`, `sitemap.ts`/`robots.ts`
- **TypeScript**, strict mode
- **Tailwind CSS** — see `tailwind.config.js` for the color/font tokens
- **Supabase** — Postgres database, Auth (admin login) and Storage (puppy photos/videos), all protected by Row Level Security
- **Framer Motion** + **GSAP ScrollTrigger** for animation
- **Resend** — server-side (`/api/notify`) email notifications for every form submission (contact/application/order/newsletter)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

Then run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase project's SQL editor — see [ADMIN_SETUP.md](ADMIN_SETUP.md) for the full walkthrough (tables, RLS, admin login, storage bucket).

## Editing content

- **Business info** (name, contact, socials, payment methods): `src/data/site.ts` — one file, all placeholder values marked `TODO`/blank.
- **Puppies for sale**: manage from `/admin` once Supabase is configured. `src/data/dogs.ts` is only the offline fallback shown if Supabase is unreachable.
- **Blog posts**: write and edit from `/admin/blog` (block editor with images, links and SEO fields) once Supabase is configured. `src/data/blog.ts` is only the offline fallback / sample-post source.
- **Team bios**: `src/data/team.ts`.
- **Branding colors/fonts**: `tailwind.config.js` (`colors.forest/ember/sky`, `fontFamily.heading/body`).

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build (also type-checks)
- `npm run start` — run the production build locally
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

## Deploying

Push to a Git repo and import it in Vercel — Next.js is auto-detected, no build config needed. Add the env vars from `.env.example` in **Vercel → Project → Settings → Environment Variables**.
