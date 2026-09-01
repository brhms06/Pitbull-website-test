import type { TeamMember } from '@/types';

const img = (id: number, w = 600, h = 600) => `https://placedog.net/${w}/${h}?id=${id}`;

/** Placeholder team profiles — replace with your real team members and photos. */
export const team: TeamMember[] = [
  {
    name: 'Jordan Turner',
    role: 'Head Breeder',
    bio: 'Jordan oversees every litter from birth to placement and handles all health testing.',
    image: img(30),
  },
  {
    name: 'Morgan Reyes',
    role: 'Vet Liaison',
    bio: 'A former vet tech, Morgan coordinates checkups, vaccinations and health records.',
    image: img(31),
  },
  {
    name: 'Alex Lin',
    role: 'Puppy Coordinator',
    bio: 'Alex matches every puppy with the right family and manages reservations nationwide.',
    image: img(32),
  },
];
