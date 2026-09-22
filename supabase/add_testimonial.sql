-- =============================================================================
-- Crown Legacy Dobermans — add/edit/remove testimonials via SQL
-- =============================================================================
-- HOW TO USE:
--   Open your Supabase project -> SQL Editor -> New query, paste ONE of the
--   sections below (the BULK ADD, ADD, EDIT or DELETE block), edit its
--   values, and click "Run". The RETURNING line(s) print the result so you
--   can confirm it worked. You can also do all of this from the site's
--   Admin -> Testimonials page — this script is just a faster way to
--   bulk-load or fix entries.
--
-- Only three fields are shown on the public site: customer name, star
-- rating (1-5), and the quote. `published` controls whether it's visible —
-- set it to false to save a draft without showing it yet.
-- =============================================================================

-- ---- BULK ADD the current 10 site testimonials -------------------------------
-- Safe to run once. Re-running adds duplicates, so only run this again if
-- you've since deleted these rows.
insert into public.testimonials (customer_name, rating, quote, published)
values
  ('Michael R.', 5, 'Our experience with Crown Legacy Dobermans was wonderful from the very beginning. The communication was excellent, and we received helpful updates throughout the process. Our Doberman is beautiful, intelligent, affectionate, and already becoming such an important part of our family. We couldn''t be happier!', true),
  ('Sarah & James', 5, 'We were impressed by the care and attention given to the puppies at Crown Legacy Dobermans. Our puppy arrived happy, energetic, and well-adjusted. The entire process was smooth and professional, and all our questions were answered promptly. We absolutely love our new family member!', true),
  ('Amanda T.', 5, 'Finding the right Doberman breeder was very important to us, and Crown Legacy Dobermans exceeded our expectations. Our puppy has an amazing temperament and is incredibly smart and loving. We are so thankful for the time and care that went into raising our little girl.', true),
  ('David M.', 5, 'From our first conversation with Crown Legacy Dobermans, we felt comfortable and confident. Our puppy is playful, affectionate, and has settled into our home beautifully. The guidance we received made bringing home our first Doberman much easier than we expected.', true),
  ('Jessica W.', 5, 'Crown Legacy Dobermans made the entire experience feel personal and professional at the same time. We appreciated the communication, the updates, and the attention given to our puppy. Our boy is absolutely gorgeous and has such a wonderful personality. We highly recommend Crown Legacy Dobermans!', true),
  ('Rachel P.', 5, 'Our female Doberman from Crown Legacy Dobermans is everything we hoped for. She is confident, playful, affectionate, and incredibly intelligent. You can tell that a lot of time and care went into preparing her for her new home. We couldn''t be more pleased with her!', true),
  ('Christopher B.', 5, 'We had so many questions before getting our Doberman, but Crown Legacy Dobermans was patient and helpful throughout the process. Everything was clearly explained, and we felt supported every step of the way. Our puppy is healthy, happy, and absolutely beautiful!', true),
  ('Lauren K.', 5, 'We had been searching for the right Doberman for a long time, and we''re so glad we found Crown Legacy Dobermans. Our puppy has a fantastic personality and has already bonded strongly with our family. He is smart, loving, and full of energy. We couldn''t ask for more!', true),
  ('Daniel & Melissa', 5, 'Crown Legacy Dobermans made welcoming our new puppy such a memorable experience. We received excellent communication and helpful information about caring for our Doberman. Our little guy is doing great and has quickly become the center of attention in our home!', true),
  ('Kevin S.', 5, 'We are extremely happy with our experience with Crown Legacy Dobermans. From the first inquiry to bringing our puppy home, everything was handled with care and professionalism. Our Doberman is absolutely stunning, very affectionate, and has an incredible temperament. We are grateful to have found Crown Legacy Dobermans!', true)
returning id, customer_name;

-- ---- CLEAN UP defective/placeholder rows ---------------------------------------
-- Removes any row left over from running the single-ADD template below
-- without editing its placeholder values first. Safe to run any time —
-- deletes nothing if there's nothing to clean up.
delete from public.testimonials
where customer_name = 'Customer Name'
  and quote = 'Their testimonial goes here.';

-- ---- ADD a single new testimonial ---------------------------------------------
-- Edit the values below, THEN select+run just this block (not the whole
-- file) — running it unedited inserts a literal "Customer Name" /
-- "Their testimonial goes here." row, which is what the CLEAN UP block
-- above exists to fix.
-- insert into public.testimonials (customer_name, rating, quote, published)
-- values (
--   'Customer Name',              -- shown on the card
--   5,                             -- star rating, 1-5
--   'Their testimonial goes here.',
--   true                            -- false to save as a draft (hidden from the public site)
-- )
-- returning id, customer_name;

-- ---- EDIT an existing testimonial --------------------------------------------
-- Find its id first (uncomment to look up by name):
-- select id, customer_name, rating, quote, published from public.testimonials order by created_at desc;
--
-- Then update it by id (uncomment and fill in):
-- update public.testimonials
-- set customer_name = 'Customer Name',
--     rating = 5,
--     quote = 'Updated testimonial text.',
--     published = true
-- where id = 'paste-the-id-here'
-- returning id, customer_name;

-- ---- DELETE a testimonial -----------------------------------------------------
-- delete from public.testimonials where id = 'paste-the-id-here';
