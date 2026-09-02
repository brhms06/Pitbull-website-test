-- =============================================================================
-- Ironline Bullies — Supabase schema
-- =============================================================================
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query.
--   2. Paste this ENTIRE file and click "Run".  It is safe to run more than once.
--   3. Create your admin login: Authentication -> Users -> "Add user"
--      (enter your email + a password, tick "Auto Confirm User").
--   4. Log in at  https://your-domain/admin  — any account you create in
--      Authentication -> Users can sign in as an admin (see is_admin() below).
--   5. IMPORTANT: disable public sign-ups (Authentication -> Settings/Providers ->
--      turn off "Allow new users to sign up"), since anyone with an account is an
--      admin here — the only accounts that should exist are ones you create above.
-- =============================================================================

-- ---------- DOGS / PRODUCTS ----------------------------------------------------
create table if not exists public.dogs (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  breed               text not null default '',
  registry            text not null default '',
  weight_label        text not null default '',
  age_label           text not null default '',
  age_group           text not null default 'Young',
  gender              text not null default 'Male',
  color               text not null default '',
  location            text not null default '',
  region              text not null default '',
  status              text not null default 'Available',
  neutered            boolean not null default true,
  vaccinated          boolean not null default true,
  vet_checked         boolean not null default true,
  microchipped        boolean not null default true,
  good_with_children  boolean not null default true,
  good_with_cats      boolean not null default true,
  good_with_dogs      boolean not null default false,
  price               numeric not null default 0,
  reserve_price       numeric not null default 0,
  breeding_price      numeric not null default 0,
  warranty_price      numeric not null default 0,
  coordinator_name    text not null default '',
  coordinator_email   text not null default '',
  coordinator_phone   text not null default '',
  personality         text[] not null default '{}',
  short_description   text not null default '',
  story               text not null default '',
  images              text[] not null default '{}',
  videos              text[] not null default '{}',
  published           boolean not null default true,
  created_at          timestamptz not null default now()
);
create index if not exists dogs_created_at_idx on public.dogs (created_at desc);

-- ---------- TESTIMONIALS (admin-managed, no public write) ---------------------
create table if not exists public.testimonials (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  dog_name      text not null default '',
  quote         text not null,
  rating        int not null default 5,
  photo_url     text not null default '',
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------- FORM SUBMISSIONS --------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text default '',
  subject     text default '',
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.puppy_applications (
  id            uuid primary key default gen_random_uuid(),
  dog_id        text default '',
  dog_name      text default '',
  name          text not null,
  email         text not null,
  phone         text default '',
  address       text default '',
  home_type     text default '',
  has_children  text default '',
  has_pets      text default '',
  experience    text default '',
  status        text not null default 'New',
  created_at    timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  customer_name         text not null,
  email                 text not null,
  phone                 text default '',
  address               text default '',
  notes                 text default '',
  items                 jsonb not null default '[]',
  total                 numeric not null default 0,
  payment_method        text not null default '',
  payment_method_value  text not null default '',
  whatsapp_opt_in       boolean not null default false,
  status                text not null default 'New',
  created_at            timestamptz not null default now()
);

-- Adds the payment-method/WhatsApp columns to an orders table that already
-- existed before this feature — safe to run repeatedly, no-op once applied.
alter table public.orders
  add column if not exists payment_method       text not null default '',
  add column if not exists payment_method_value text not null default '',
  add column if not exists whatsapp_opt_in      boolean not null default false;

-- ---------- BLOG POSTS (admin-managed CMS) ------------------------------------
create table if not exists public.blog_posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  excerpt           text not null default '',
  content_json      jsonb not null default '[]',
  content_html      text not null default '',
  featured_image    text not null default '',
  og_image          text not null default '',
  meta_title        text not null default '',
  meta_description  text not null default '',
  tags              text[] not null default '{}',
  author            text not null default 'Ironline Bullies',
  published         boolean not null default false,
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists blog_posts_created_at_idx   on public.blog_posts (created_at desc);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

-- ---------- ADMIN CHECK --------------------------------------------------------
-- Any signed-in Supabase user is treated as an admin — there's no separate
-- allowlist table. This is safe ONLY because public sign-ups must stay disabled
-- (see the HOW TO USE note above), so the only accounts that can ever exist are
-- ones you create yourself in Authentication -> Users.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select auth.uid() is not null;
$$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.dogs                  enable row level security;
alter table public.testimonials          enable row level security;
alter table public.blog_posts            enable row level security;
alter table public.contact_messages      enable row level security;
alter table public.puppy_applications    enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.orders                enable row level security;

-- DOGS: everyone can read published dogs; admins can do everything.
drop policy if exists "dogs public read" on public.dogs;
drop policy if exists "dogs admin all"   on public.dogs;
create policy "dogs public read" on public.dogs
  for select using (published = true or public.is_admin());
create policy "dogs admin all" on public.dogs
  for all using (public.is_admin()) with check (public.is_admin());

-- TESTIMONIALS: everyone can read published testimonials; admins manage them.
-- No public insert policy — testimonials are only ever written by an admin.
drop policy if exists "testimonials public read" on public.testimonials;
drop policy if exists "testimonials admin all"   on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select using (published = true or public.is_admin());
create policy "testimonials admin all" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- BLOG POSTS: everyone can read published posts; admins manage them.
-- No public insert policy — posts are only ever written by an admin.
drop policy if exists "blog posts public read" on public.blog_posts;
drop policy if exists "blog posts admin all"   on public.blog_posts;
create policy "blog posts public read" on public.blog_posts
  for select using (published = true or public.is_admin());
create policy "blog posts admin all" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- SUBMISSIONS: anyone can insert (submit a form); only admins can read/manage.
do $$
declare t text;
begin
  foreach t in array array[
    'contact_messages','puppy_applications','newsletter_subscribers','orders'
  ] loop
    execute format('drop policy if exists "%s insert" on public.%I', t, t);
    execute format('drop policy if exists "%s admin"  on public.%I', t, t);
    execute format(
      'create policy "%s insert" on public.%I for insert with check (true)', t, t);
    execute format(
      'create policy "%s admin" on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t, t);
  end loop;
end $$;

-- =============================================================================
-- STORAGE — public bucket for dog photos & videos
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('dog-images', 'dog-images', true, 209715200)
on conflict (id) do update set public = true, file_size_limit = 209715200;

drop policy if exists "dog images public read" on storage.objects;
drop policy if exists "dog images admin write"  on storage.objects;
drop policy if exists "dog images admin update" on storage.objects;
drop policy if exists "dog images admin delete" on storage.objects;

create policy "dog images public read" on storage.objects
  for select using (bucket_id = 'dog-images');
create policy "dog images admin write" on storage.objects
  for insert with check (bucket_id = 'dog-images' and public.is_admin());
create policy "dog images admin update" on storage.objects
  for update using (bucket_id = 'dog-images' and public.is_admin());
create policy "dog images admin delete" on storage.objects
  for delete using (bucket_id = 'dog-images' and public.is_admin());

-- =============================================================================
-- STORAGE — public bucket for blog post images
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit)
values ('blog-images', 'blog-images', true, 20971520)
on conflict (id) do update set public = true, file_size_limit = 20971520;

drop policy if exists "blog images public read" on storage.objects;
drop policy if exists "blog images admin write"  on storage.objects;
drop policy if exists "blog images admin update" on storage.objects;
drop policy if exists "blog images admin delete" on storage.objects;

create policy "blog images public read" on storage.objects
  for select using (bucket_id = 'blog-images');
create policy "blog images admin write" on storage.objects
  for insert with check (bucket_id = 'blog-images' and public.is_admin());
create policy "blog images admin update" on storage.objects
  for update using (bucket_id = 'blog-images' and public.is_admin());
create policy "blog images admin delete" on storage.objects
  for delete using (bucket_id = 'blog-images' and public.is_admin());
