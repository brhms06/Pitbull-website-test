# Admin Dashboard & Supabase Setup

The website is wired to Supabase so that puppies posted in the admin dashboard appear
live on the public site, and every form submission (application, contact, order,
newsletter) is saved for you to review.

## 1. Create a Supabase project

Create a new project at <https://supabase.com/dashboard> (use a **new** project —
don't reuse one from another site). Copy its **Project URL** and **anon public key**
from Project Settings → API into a `.env.local` file (copy `.env.example` first).

## 2. Create the database tables (one time, ~30 seconds)

1. Open your project → **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](supabase/schema.sql), copy the whole file, paste it, click **Run**.
   - This creates all tables (including blog posts), security rules, and the puppy photo/video and blog image storage buckets.
   - It is safe to run again later.
3. Near the bottom of the file, replace `admin@ironlinebullies.com` with your real
   admin email **before** running it (or edit and re-run the bootstrap section only).

## 3. Create your admin login

- Supabase → **Authentication → Users → Add user** — enter your email + a password,
  tick **Auto Confirm User**.
- If that email matches the one you set in the schema, it is automatically granted
  admin access.
- You can change the password any time in Supabase → Authentication → Users.

## 4. Log in and add puppies

- Go to **`https://your-domain.com/admin`** and sign in.
- **Puppies → Add a puppy**: fill in details, upload photos, choose *Published*, save.
  It appears on the public site immediately.
- Or click **Import sample puppies** once to pre-load the demo litter (you can edit/delete them).
- **Blog → Write a post**: a block-based editor (drag to reorder, images, links) plus an SEO sidebar (meta title/description, tags, featured image). Choose *Published*, save, and it appears at `/blog` immediately.
- **Testimonials**: add happy-customer quotes shown on the Home page.
- **Submissions**: review puppy applications, messages, orders and subscribers.

## 5. Email notifications (Resend)

Every form submission (contact, puppy application/reservation, order, newsletter) posts to
`/api/notify`, which emails your team via [Resend](https://resend.com). To enable it:

1. Create a free account at <https://resend.com> and copy an API key.
2. Add `RESEND_API_KEY=<your key>` to `.env.local` (and to Vercel's env vars — see below).

> Until you verify a sending domain in the Resend dashboard, mail can only be sent from
> `onboarding@resend.dev` and only **to the email address of your Resend account**. Verify
> your own domain in Resend once you're ready to deliver to the `email` set in `src/data/site.ts`.
> If `RESEND_API_KEY` isn't set, forms still save to Supabase — they just skip the email.

## 6. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
RESEND_API_KEY=<your resend key>
```

> Security note: the **anon key is public by design** and safe to ship in the browser —
> every table is protected by Row Level Security. Never put the `service_role` key in the app.
> `RESEND_API_KEY` is server-only — never prefix it with `NEXT_PUBLIC_`.
