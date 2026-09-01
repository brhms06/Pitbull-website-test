export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'american-bully-vs-pitbull-difference',
    title: 'American Bully vs. Pitbull: What Is the Difference?',
    date: '2024-02-10',
    author: 'Ironline Bullies',
    excerpt:
      '"Pitbull" and "American Bully" get used interchangeably, but they are not the same thing. Here is how the breeds actually compare.',
    content: `
      <h2>Two Related, Distinct Breeds</h2>
      <p>"Pitbull" is an umbrella term that usually refers to the American Pit Bull Terrier and similar breeds. The American Bully is a newer breed, developed in the 1990s by breeding American Pit Bull Terriers with American Staffordshire Terriers and other bully breeds to emphasize a bulkier, more compact build.</p>

      <h3>Build and Size</h3>
      <p>American Pit Bull Terriers are lean, athletic and built for endurance. American Bullies are shorter, wider and more heavily muscled, bred primarily as companion dogs rather than working dogs. Bullies also come in size classes — Pocket, Standard, Classic and XL.</p>

      <h3>Temperament</h3>
      <p>Both breeds are known for being affectionate, loyal and great with families when properly socialized. American Bullies were specifically bred to have an even more stable, people-oriented temperament, which is part of why they have become such popular family companions.</p>

      <h3>Which One Is Right for You?</h3>
      <p>If you want an athletic, high-energy companion for hiking and training, a Pit Bull Terrier may be the better fit. If you want a lower-energy, muscular companion who is happy to relax at home, an American Bully is worth a look. Either way, always ask a breeder about health testing and socialization before bringing a puppy home.</p>
    `,
    image: 'https://placedog.net/1400/700?id=21',
    published: true,
  },
  {
    id: '2',
    slug: 'bringing-home-your-new-puppy',
    title: 'Bringing Home Your New Puppy: The First 30 Days',
    date: '2024-03-05',
    author: 'Ironline Bullies',
    excerpt:
      'The first month sets the tone for your puppy\'s whole life. Here is what to expect and how to prepare.',
    content: `
      <h2>Before Puppy Arrives</h2>
      <p>Puppy-proof your home, pick a vet, and set up a dedicated space with a crate, bed and food/water bowls. Decide on a feeding schedule before your puppy comes home so everyone in the household stays consistent.</p>

      <h3>Week One: Settling In</h3>
      <p>Expect some whining the first few nights — this is normal. Keep the crate near your bedroom initially, stick to a consistent potty schedule, and avoid overwhelming your puppy with too many visitors right away.</p>

      <h3>Weeks Two to Four: Building Routine</h3>
      <p>Start basic house training in earnest, introduce short positive-reinforcement training sessions, and begin gentle socialization — new sounds, surfaces and (once fully vaccinated) safe introductions to other dogs.</p>

      <h3>Health Checklist</h3>
      <p>Schedule your first vet visit within 72 hours of pickup, keep up with the vaccination schedule your breeder provided, and ask about spay/neuter timing appropriate for a bully breed's growth plates.</p>
    `,
    image: 'https://placedog.net/1400/700?id=22',
    published: true,
  },
];
