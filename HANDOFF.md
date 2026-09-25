# Client Handoff Runbook

Use this when it's actually time to transfer the site to the customer — not
before. Until then, the site intentionally keeps running on the developer's
own accounts (see the hardcoded Supabase fallback note in step 5 below).

Paste this file's path into a new chat ("let's do the handoff, follow
HANDOFF.md") when the day comes.

## Accounts the customer needs (create these first)

- **GitHub** — will own the source repo.
- **Vercel** — hosts/deploys the site.
- **Supabase** — database + admin login + file storage.
- **Resend** — sends the admin-notification emails.
- **Hostinger** — domain registrar + Titan Email (business inbox).

## Order of operations

### 1. Repo → customer's GitHub

Recommended: GitHub *Transfer ownership* (repo → Settings → General → Danger
Zone) from the developer's repo to the customer's account — preserves full
history, customer just needs to give you his GitHub username.
Alternative: fresh repo + push, if he'd rather not inherit the dev's commit
history/username.

### 2. Supabase → new project

- Create a new project (a fresh one, don't reuse the dev's).
- Run `supabase/schema.sql` in its SQL Editor — creates all 8 tables (`dogs`,
  `testimonials`, `contact_messages`, `puppy_applications`,
  `puppy_contracts`, `newsletter_subscribers`, `orders`, `blog_posts`), RLS
  policies, and the two storage buckets (`dog-images`, `blog-images`). Safe
  to re-run. (Same steps as `ADMIN_SETUP.md` §2, already used once before.)
- Create the customer's admin login: Supabase → Authentication → Users →
  Add user (tick **Auto Confirm User**).
- **Disable public sign-ups**: Authentication → Settings → turn off "Allow
  new users to sign up." (Any authenticated user is treated as admin — see
  `is_admin()` in the schema — so this is not optional.)
- No data migration needed as of this writing — confirmed there's no real
  production data yet, just re-run the schema fresh.

### 3. Vercel → import the repo

- New Vercel project under the customer's account, importing the (now his)
  GitHub repo.
- Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `RESEND_API_KEY` (values from the new Supabase project + step 6 below).
- Deploy, sanity-check on the `*.vercel.app` URL before touching DNS.

### 4. Hostinger → buy the domain

Just registration at this point — DNS gets managed from Vercel (next step),
not Hostinger's own zone editor.

### 5. Point the domain at Vercel — **use Vercel-managed DNS**

Not Hostinger's DNS Zone Editor — that has previously reset/reclaimed the
apex `@` A record without warning (Hostinger's "website builder"/parking
page feature reasserting itself). Instead:

- Vercel → Project → Domains → add the domain → **Advanced Settings →
  "Enable Vercel DNS."**
- At Hostinger, change the domain's **nameservers** to Vercel's (shown in
  that same panel). This is the only thing that happens at Hostinger's end
  for hosting — everything else below happens inside Vercel's DNS panel.
- Vercel then auto-manages its own A/CNAME records for the site — nothing
  to add manually for that part.

### 6. Resend — verify a subdomain (never done before, this is the trick)

- Verify **`mail.customerdomain.com`**, not the root domain. Keeps Resend
  fully isolated from Titan's root-domain MX records — no record conflict
  possible, because they live on different hostnames.
- Resend dashboard → Domains → Add Domain → enter the subdomain → it shows
  the exact records to add (format has changed over time — CNAME-based for
  newer domains vs. the older TXT+MX pair — always copy what's shown live,
  don't rely on a fixed list).
- Add those records **inside Vercel's DNS panel** (Domain → Advanced
  Settings → DNS Records → "+ Add Record", or `vercel dns add`) since Vercel
  now owns the zone. Verification usually completes in ~15 min (Resend
  keeps checking for up to 72h).
- Optional: add a `_dmarc` TXT record (`v=DMARC1; p=none; rua=mailto:...`)
  once SPF/DKIM are passing, for monitoring.
- Once verified, get the new `RESEND_API_KEY` into Vercel's env vars
  (step 3) if not already done.

### 7. Titan Email — root domain

- Two MX records at `@`: `mx1.titan.email` (priority 10), `mx2.titan.email`
  (priority 20), plus Titan's SPF TXT record — also added inside **Vercel's
  DNS panel**, same place as step 6, just a different hostname (`@` instead
  of `mail.`).
- Check Vercel's DNS presets list first — if Titan (or the underlying
  provider) is listed, it may auto-fill these for you.
- No conflict with Resend: Titan is on `@`, Resend is on `mail.` — separate
  hostnames, separate record sets.

### 8. Code changes (do these now, at transfer time — not before)

- **`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`** — remove
  the hardcoded fallback (`process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://msgcdajmlelowisaqgpj.supabase.co'`
  and the matching anon-key fallback) in all three files. Replace with a
  loud failure if the env vars are missing, e.g.:
  ```ts
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars — see .env.example.');
  }
  ```
  Without this, a misconfigured deploy silently keeps writing the
  customer's real orders/PII into the *developer's* Supabase project
  instead of failing loudly.
- **`src/data/site.ts`** — update `email` (→ the new Titan inbox, e.g.
  `hello@customerdomain.com`), `social`, and `url`
  (→ `https://customerdomain.com`) to the customer's real details.
- **`src/app/api/notify/route.ts`** — update `from:` (currently
  `'Ironline Dobermans <onboarding@resend.dev>'`) to the verified Resend
  subdomain, e.g. `'Ironline Dobermans <notify@mail.customerdomain.com>'`.
- Redeploy after these changes.

### 9. Final verification

- Submit one test of each form (contact, application, order) end-to-end
  against production and confirm the admin email arrives at the new Titan
  inbox, styled correctly, and that replying reaches the customer.
- Confirm the site loads on the real domain with a valid SSL cert (Vercel
  auto-provisions this once DNS propagates).

### 10. Offboard the developer

Once the customer confirms everything works: remove the developer's own
access from all 5 accounts (Vercel collaborator, GitHub if not transferred,
Resend team member, Supabase project member, Hostinger).
