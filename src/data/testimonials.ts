import type { Testimonial } from '@/types';

const img = (id: number, w = 200, h = 200) => `https://placedog.net/${w}/${h}?id=${id}`;

/**
 * Fallback testimonials shown if Supabase is unreachable or empty. Real
 * testimonials are managed from the admin dashboard (Testimonials tab).
 */
export const testimonials: Testimonial[] = [
  {
    id: 'seed-1',
    customerName: 'The Ramirez Family',
    dogName: 'Sadie',
    quote:
      "Sadie has been the perfect addition to our family. She's gentle with our kids and clearly health-tested — you can tell this breeder does it right.",
    rating: 5,
    photo: img(40),
  },
  {
    id: 'seed-2',
    customerName: 'Marcus D.',
    dogName: 'Diesel',
    quote:
      'Communication was great from reservation to pickup, and Diesel arrived happy, healthy and exactly as described.',
    rating: 5,
    photo: img(41),
  },
  {
    id: 'seed-3',
    customerName: 'Priya S.',
    dogName: 'Nova',
    quote:
      "Nova is smart, well-socialized and clearly raised with a lot of love. Couldn't ask for a better puppy experience.",
    rating: 5,
    photo: img(42),
  },
];
