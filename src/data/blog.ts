import { dobermanPhotos } from '@/data/dobermanPhotos';

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
    slug: 'doberman-colors-size-temperament',
    title: 'Doberman Puppies 101: Colors, Size & Temperament Explained',
    date: '2024-02-10',
    author: 'Crown Legacy Dobermans',
    excerpt:
      'Dobermans come in a handful of striking colors and one of the most consistent temperaments of any breed. Here is what to know before choosing your puppy.',
    content: `
      <h2>One Breed, a Recognizable Look</h2>
      <p>Unlike breeds with wide variation, the Doberman Pinscher has a consistent, athletic silhouette — a sleek, muscular body built for speed and endurance. Well-bred, well-socialized Dobermans share the same core traits: they are loyal, intelligent and deeply devoted to their family.</p>

      <h3>Size: What to Expect</h3>
      <p>Male Dobermans typically stand 26-28 inches at the shoulder and weigh 75-100 lbs at maturity; females run slightly smaller, around 24-26 inches and 60-90 lbs. Full adult size is usually reached by 18-24 months.</p>

      <h3>Coat Colors You'll See</h3>
      <p>The AKC recognizes four Doberman colors: black & rust, red & rust, blue & rust, and fawn (Isabella) & rust. All four carry the same signature markings above the eyes, on the muzzle, throat, chest, legs and below the tail. Color is purely cosmetic and has no bearing on health or personality.</p>

      <h3>Temperament: What to Really Expect</h3>
      <p>A well-raised Doberman is affectionate, alert and typically great with children when properly socialized from puppyhood. They are famously intelligent and trainable, thrive on mental stimulation and a job to do, and form intensely loyal bonds with their people.</p>

      <h3>Ear Cropping and Tail Docking</h3>
      <p>Traditionally Dobermans are shown with cropped ears and docked tails, but neither is required — many owners today choose the natural look. We can discuss both options and connect you with a vet experienced in the procedure if you have a preference.</p>
    `,
    image: dobermanPhotos[6],
    published: true,
  },
  {
    id: '2',
    slug: 'bringing-home-your-new-puppy',
    title: 'Bringing Home Your New Puppy: The First 30 Days',
    date: '2024-03-05',
    author: 'Crown Legacy Dobermans',
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
      <p>Schedule your first vet visit within 72 hours of pickup, keep up with the vaccination schedule your breeder provided, and ask about spay/neuter timing appropriate for a Doberman's growth plates.</p>
    `,
    image: dobermanPhotos[7],
    published: true,
  },
];
