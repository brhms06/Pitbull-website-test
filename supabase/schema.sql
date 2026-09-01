-- =============================================================================
-- Ironline Bullies — Supabase schema
-- =============================================================================
-- HOW TO USE:
--   1. Open your Supabase project -> SQL Editor -> New query.
--   2. Paste this ENTIRE file and click "Run".  It is safe to run more than once.
--   3. Create your admin login: Authentication -> Users -> "Add user"
--      (enter your email + a password, tick "Auto Confirm User").
--   4. Update the bootstrap email near the bottom of this file to that address,
--      then re-run this file (or run the final INSERT manually).
--   5. Log in at  https://your-domain/admin
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
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  email          text not null,
  phone          text default '',
  address        text default '',
  notes          text default '',
  items          jsonb not null default '[]',
  total          numeric not null default 0,
  status         text not null default 'New',
  created_at     timestamptz not null default now()
);

-- ---------- ADMINS ALLOWLIST --------------------------------------------------
-- A user is treated as an admin only if their auth id appears here.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table public.dogs                  enable row level security;
alter table public.testimonials          enable row level security;
alter table public.contact_messages      enable row level security;
alter table public.puppy_applications    enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.orders                enable row level security;
alter table public.admins                enable row level security;

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

-- ADMINS: a signed-in user may check whether *they* are an admin.
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select using (user_id = auth.uid());

-- ---------- BOOTSTRAP ADMIN ACCOUNT ------------------------------------------
-- TODO: replace this placeholder email with your real admin login email.
-- This email is automatically granted admin access, whether the user is created
-- before or after this script runs.
create or replace function public.handle_new_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email = 'admin@ironlinebullies.com' then
    insert into public.admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_admin();

-- Grant now if the account already exists.
insert into public.admins (user_id)
select id from auth.users where email = 'admin@ironlinebullies.com'
on conflict do nothing;

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
