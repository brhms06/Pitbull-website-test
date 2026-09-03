-- =============================================================================
-- Ironline Bullies — add a single puppy via SQL
-- =============================================================================
-- HOW TO USE:
--   1. Edit the values in the "EDIT THESE" block below — that's all you need.
--      Everything in the "LEAVE AS DEFAULT" block can stay as-is; it's not
--      shown on the puppy card and matches what the admin "Add puppy" form
--      already defaults to.
--   2. Open your Supabase project -> SQL Editor -> New query, paste this file, click "Run".
--   3. The RETURNING line at the bottom prints the new id/slug/name so you can confirm it worked.
--
-- IMAGES/VIDEOS: this script can only store URLs, it can't upload files. Either
--   (a) add the puppy here with images/videos left as '{}', then open it from the
--       admin "Edit puppy" form and upload there (recommended), or
--   (b) upload yourself first (Supabase Storage -> dog-images / dog-videos bucket),
--       copy the public URLs, and paste them into the arrays below.
--   Leaving images as '{}' is valid SQL but the puppy card/listing will show a
--   placeholder until at least one photo is added.
--
-- SLUG: must be unique across all puppies — lowercase, hyphenated, no spaces,
--   matching the name (e.g. name 'Pascal' -> slug 'pascal', 'pascal-2' if reused).
-- =============================================================================

insert into public.dogs (
  -- ---- EDIT THESE ----------------------------------------------------------
  slug,               -- lowercase-hyphenated version of the name, must be unique
  name,               -- shown on the card
  breed,              -- shown on the card, e.g. 'American Bully - Standard'
  price,              -- shown on the card — the full-payment price buyers see
  status,             -- shown on the card as "Condition" — 'Available' | 'Pending' | 'Sold'
  gender,             -- shown on the card as "Sex" — 'Male' | 'Female'
  age_label,          -- shown on the card, e.g. '2 weeks old'
  images,             -- text array of public photo URLs — see IMAGES note above
  videos,             -- text array of public video URLs, optional

  -- ---- LEAVE AS DEFAULT (not shown on the card) -----------------------------
  registry, weight_label, age_group, color, location, region,
  neutered, vaccinated, vet_checked, microchipped,
  good_with_children, good_with_cats, good_with_dogs,
  reserve_price, breeding_price, warranty_price,
  coordinator_name, coordinator_email, coordinator_phone,
  personality, short_description, story, published
) values (
  -- ---- EDIT THESE ----------------------------------------------------------
  'pascal',
  'Pascal',
  'American Bully - Standard',
  2500,
  'Available',
  'Male',
  '2 weeks old',
  array[]::text[],
  array[]::text[],

  -- ---- LEAVE AS DEFAULT ------------------------------------------------------
  '', '', 'Puppy', '', '', '',
  false, true, true, true,
  true, true, true,
  0, 0, 0,
  '', '', '',
  array[]::text[], '', '', true
)
returning id, slug, name;
