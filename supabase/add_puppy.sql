-- =============================================================================
-- Ironline Bullies — add a single puppy via SQL
-- =============================================================================
-- HOW TO USE:
--   1. Edit the VALUES below with the real puppy's details.
--   2. Open your Supabase project -> SQL Editor -> New query, paste this file, click "Run".
--   3. The RETURNING line at the bottom prints the new id/slug/name so you can confirm it worked.
--
-- IMAGES: this script can only store image URLs, it can't upload files. Either
--   (a) add the puppy here with images left as '{}', then open it from the admin
--       "Edit puppy" form and upload photos there (recommended), or
--   (b) upload photos yourself first (Supabase Storage -> dog-images bucket),
--       copy their public URLs, and paste them into the images array below.
--   Leaving images as '{}' is valid SQL but the puppy card/listing will show a
--   placeholder until at least one photo is added.
--
-- SLUG: must be unique across all puppies — lowercase, hyphenated, no spaces
--   (e.g. 'pascal', 'pascal-2' if the name is reused).
-- =============================================================================

insert into public.dogs (
  slug,               -- unique, lowercase-hyphenated (see note above)
  name,               -- required — shown on the card
  breed,              -- shown on the card, e.g. 'American Bully - Standard'
  registry,           -- e.g. 'ABKC', 'UKC' — leave '' if none
  weight_label,       -- free text, e.g. '45 lbs (est. adult)'
  age_label,          -- shown on the card, e.g. '2 weeks old'
  age_group,          -- 'Puppy' | 'Young' | 'Adult' | 'Senior'
  gender,             -- shown on the card as "Sex" — 'Male' | 'Female'
  color,              -- e.g. 'Blue', 'Fawn', 'Chocolate tri'
  location,
  region,
  status,             -- shown on the card as "Condition" — 'Available' | 'Pending' | 'Sold'
  neutered,
  vaccinated,
  vet_checked,
  microchipped,
  good_with_children,
  good_with_cats,
  good_with_dogs,
  price,              -- shown on the card — the full-payment price buyers see
  reserve_price,      -- reservation deposit; 0 = use the site default
  breeding_price,     -- add breeding rights price; 0 = use the site default
  warranty_price,     -- extended health warranty price; 0 = use the site default
  coordinator_name,
  coordinator_email,
  coordinator_phone,
  personality,        -- text array, e.g. array['Loyal','Playful']
  short_description,  -- shown on cards/listings if you use it elsewhere
  story,              -- full story shown on the puppy's own page
  images,             -- text array of public photo URLs — see IMAGES note above
  videos,             -- text array of public video URLs, optional
  published           -- true = visible on the live site right away
) values (
  'pascal',
  'Pascal',
  'American Bully - Standard',
  '',
  '',
  '2 weeks old',
  'Puppy',
  'Male',
  '',
  '',
  '',
  'Available',
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  2500,
  0,
  0,
  0,
  '',
  '',
  '',
  array[]::text[],
  '',
  '',
  array[]::text[],
  array[]::text[],
  true
)
returning id, slug, name;
