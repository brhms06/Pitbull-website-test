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
  {
    id: 'seed-4',
    customerName: 'The Whitfield Family',
    dogName: 'Duke',
    quote:
      "Duke settled in like he'd always been ours. He arrived with every record we needed and the breeder checked in for weeks after to make sure he was doing well.",
    rating: 5,
    photo: img(43),
  },
  {
    id: 'seed-5',
    customerName: 'Jordan K.',
    dogName: 'Zeus',
    quote:
      'Zeus is everything they described — calm, patient with our kids, and clearly well cared for before we ever met him. Ground transport went smoothly too.',
    rating: 5,
    photo: img(44),
  },
  {
    id: 'seed-6',
    customerName: 'The Alvarez Family',
    dogName: 'Coco',
    quote:
      "We flew in a flight nanny for Coco and the whole process was reassuring from start to finish. She's fearless and snuggly, exactly as promised.",
    rating: 5,
    photo: img(45),
  },
  {
    id: 'seed-7',
    customerName: 'Trevor B.',
    dogName: 'Bruno',
    quote:
      'Bruno is goofy and affectionate with the whole family, and the health guarantee paperwork gave us real peace of mind.',
    rating: 5,
    photo: img(46),
  },
];
