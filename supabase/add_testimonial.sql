-- =============================================================================
-- Ironline Dobermans — add/edit/remove testimonials via SQL
-- =============================================================================
-- HOW TO USE:
--   Open your Supabase project -> SQL Editor -> New query, paste ONE of the
--   sections below (the ADD, EDIT or DELETE block), edit its values, and
--   click "Run". The RETURNING line prints the result so you can confirm it
--   worked. You can also do all of this from the site's Admin -> Testimonials
--   page — this script is just a faster way to bulk-load or fix entries.
--
-- Only three fields are shown on the public site: customer name, star
-- rating (1-5), and the quote. `published` controls whether it's visible —
-- set it to false to save a draft without showing it yet.
-- =============================================================================

-- ---- ADD a new testimonial ---------------------------------------------------
insert into public.testimonials (customer_name, rating, quote, published)
values (
  'Customer Name',              -- shown on the card
  5,                             -- star rating, 1-5
  'Their testimonial goes here.',
  true                            -- false to save as a draft (hidden from the public site)
)
returning id, customer_name;

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
