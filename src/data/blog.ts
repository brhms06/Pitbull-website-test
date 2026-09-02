import { pitbullPhotos } from '@/data/pitbullPhotos';

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
    title: 'Pitbull Puppies 101: Sizes, Colors & Temperament Explained',
    date: '2024-02-10',
    author: 'Ironline Bullies',
    excerpt:
      'Pitbulls come in more shapes, colors and sizes than most people expect. Here is what to know before choosing your puppy.',
    content: `
      <h2>Not Just One Look</h2>
      <p>"Pitbull" covers a range of builds, from lean and athletic to short and heavily muscled. Whatever the build, well-bred, well-socialized Pitbulls share the same core traits: they are loyal, people-oriented and eager to be part of the family.</p>

      <h3>Size Classes Explained</h3>
      <p>Our puppies are grouped into four size classes — Pocket (compact, often under 20 lbs), Standard (the classic mid-size build), Classic (a leaner, more athletic frame), and XL (taller and heavier, often 90+ lbs at maturity). The class affects adult size and build, not temperament — every size makes an equally devoted companion.</p>

      <h3>Coat Colors You'll See</h3>
      <p>Pitbulls come in a wide range of colors: solid fawn, blue, black and red, striking brindle and merle patterns, and rarer dilute colors like lilac and chocolate tri. Color is purely cosmetic and has no bearing on health or personality.</p>

      <h3>Temperament: What to Really Expect</h3>
      <p>A well-raised Pitbull is affectionate, loyal and typically great with children when properly socialized from puppyhood. They thrive on attention and do best as part of an active family life rather than left alone for long stretches.</p>

      <h3>Choosing the Right Puppy for Your Home</h3>
      <p>Think about space and energy level: a Pocket or Classic Pitbull suits smaller households, while a Standard or XL needs more room to stretch out. Whichever size you choose, always ask about health testing, vaccinations and socialization before bringing a puppy home.</p>
    `,
    image: pitbullPhotos[6],
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
      <p>Schedule your first vet visit within 72 hours of pickup, keep up with the vaccination schedule your breeder provided, and ask about spay/neuter timing appropriate for a Pitbull's growth plates.</p>
    `,
    image: pitbullPhotos[7],
    published: true,
  },
];
