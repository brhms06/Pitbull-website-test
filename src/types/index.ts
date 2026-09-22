export type DogStatus = 'Available' | 'Pending' | 'Sold';
export type DogGender = 'Male' | 'Female';
export type AgeGroup = 'Puppy' | 'Young' | 'Adult' | 'Senior';

export interface Dog {
  id: string;
  name: string;
  breed: string; // e.g. "Doberman Pinscher"
  registry: string; // e.g. "AKC", "UKC" — blank if not registered
  weightLabel: string; // e.g. "45 lbs (est. adult)"
  ageLabel: string; // human readable e.g. "10 weeks old"
  ageGroup: AgeGroup;
  gender: DogGender;
  color: string;
  location: string;
  region: string;
  status: DogStatus;
  neutered: boolean;
  vaccinated: boolean;
  vetChecked: boolean;
  microchipped: boolean;
  goodWithChildren: boolean;
  goodWithCats: boolean;
  goodWithDogs: boolean;
  price: number; // full payment price
  reservePrice?: number; // reservation deposit (0 = use default)
  breedingPrice?: number; // price with breeding rights (0 = use default)
  warrantyPrice?: number; // price with extended warranty (0 = use default)
  coordinator: { name: string; email: string; phone: string };
  personality: string[];
  shortDescription: string;
  story: string;
  images: string[];
  videos?: string[];
}

export interface Testimonial {
  id: string;
  customerName: string;
  quote: string;
  rating: number; // 1-5
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}
