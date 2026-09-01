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
   - This creates all tables, security rules and the puppy photo/video storage bucket.
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
- **Testimonials**: add happy-customer quotes shown on the Home page.
- **Submissions**: review puppy applications, messages, orders and subscribers.

## 5. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=<your web3forms key>
```

> Security note: the **anon key is public by design** and safe to ship in the browser —
> every table is protected by Row Level Security. Never put the `service_role` key in the app.
