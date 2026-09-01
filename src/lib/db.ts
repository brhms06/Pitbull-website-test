import { supabase, DOG_IMAGES_BUCKET } from './supabase/client';
import { dogs as seedDogs } from '@/data/dogs';
import { testimonials as seedTestimonials } from '@/data/testimonials';
import type { Dog, AgeGroup, DogGender, DogStatus, Testimonial } from '@/types';

/** Shape of a row in the `dogs` table (snake_case). */
export interface DogRow {
  id: string;
  slug: string;
  name: string;
  breed: string;
  registry: string;
  weight_label: string;
  age_label: string;
  age_group: AgeGroup;
  gender: DogGender;
  color: string;
  location: string;
  region: string;
  status: DogStatus;
  neutered: boolean;
  vaccinated: boolean;
  vet_checked: boolean;
  microchipped: boolean;
  good_with_children: boolean;
  good_with_cats: boolean;
  good_with_dogs: boolean;
  price: number;
  reserve_price: number;
  breeding_price: number;
  warranty_price: number;
  coordinator_name: string;
  coordinator_email: string;
  coordinator_phone: string;
  personality: string[];
  short_description: string;
  story: string;
  images: string[];
  videos: string[];
  published: boolean;
  created_at: string;
}

/** Editable dog fields used by the admin form. `id` is the row uuid (edit only). */
export interface DogInput {
  id?: string;
  slug: string;
  name: string;
  breed: string;
  registry: string;
  weightLabel: string;
  ageLabel: string;
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
  price: number;
  reservePrice: number;
  breedingPrice: number;
  warrantyPrice: number;
  coordinatorName: string;
  coordinatorEmail: string;
  coordinatorPhone: string;
  personality: string[];
  shortDescription: string;
  story: string;
  images: string[];
  videos: string[];
  published: boolean;
}

/** A Dog with its admin metadata (db uuid + publish flag) attached. */
export interface AdminDog extends Dog {
  rowId: string;
  published: boolean;
  createdAt: string;
}

export const rowToAdminDog = (r: DogRow): AdminDog => ({
  rowId: r.id,
  id: r.slug, // public URLs use the slug
  name: r.name,
  breed: r.breed,
  registry: r.registry,
  weightLabel: r.weight_label,
  ageLabel: r.age_label,
  ageGroup: r.age_group,
  gender: r.gender,
  color: r.color,
  location: r.location,
  region: r.region,
  status: r.status,
  neutered: r.neutered,
  vaccinated: r.vaccinated,
  vetChecked: r.vet_checked,
  microchipped: r.microchipped,
  goodWithChildren: r.good_with_children,
  goodWithCats: r.good_with_cats,
  goodWithDogs: r.good_with_dogs,
  price: Number(r.price),
  reservePrice: Number(r.reserve_price ?? 0),
  breedingPrice: Number(r.breeding_price ?? 0),
  warrantyPrice: Number(r.warranty_price ?? 0),
  coordinator: {
    name: r.coordinator_name,
    email: r.coordinator_email,
    phone: r.coordinator_phone,
  },
  personality: r.personality ?? [],
  shortDescription: r.short_description,
  story: r.story,
  images: r.images ?? [],
  videos: r.videos ?? [],
  published: r.published,
  createdAt: r.created_at,
});

const inputToRow = (d: DogInput) => ({
  slug: d.slug,
  name: d.name,
  breed: d.breed,
  registry: d.registry,
  weight_label: d.weightLabel,
  age_label: d.ageLabel,
  age_group: d.ageGroup,
  gender: d.gender,
  color: d.color,
  location: d.location,
  region: d.region,
  status: d.status,
  neutered: d.neutered,
  vaccinated: d.vaccinated,
  vet_checked: d.vetChecked,
  microchipped: d.microchipped,
  good_with_children: d.goodWithChildren,
  good_with_cats: d.goodWithCats,
  good_with_dogs: d.goodWithDogs,
  price: d.price,
  reserve_price: d.reservePrice,
  breeding_price: d.breedingPrice,
  warranty_price: d.warrantyPrice,
  coordinator_name: d.coordinatorName,
  coordinator_email: d.coordinatorEmail,
  coordinator_phone: d.coordinatorPhone,
  personality: d.personality,
  short_description: d.shortDescription,
  story: d.story,
  images: d.images,
  videos: d.videos,
  published: d.published,
});

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'dog';

// ---------------------------------------------------------------------------
// PUBLIC READS (used by the customer-facing site)
// ---------------------------------------------------------------------------

/**
 * Fetch published dogs for the public site. If Supabase is unreachable we
 * fall back to the bundled demo data so the site is never blank.
 */
export async function fetchPublicDogs(): Promise<Dog[]> {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.warn('[db] falling back to seed dogs:', error?.message);
    return seedDogs;
  }
  return (data as DogRow[]).map(rowToAdminDog);
}

export async function fetchPublicDogBySlug(slug: string): Promise<Dog | undefined> {
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    return seedDogs.find((d) => d.id === slug);
  }
  return data ? rowToAdminDog(data as DogRow) : undefined;
}

export async function fetchPublicTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !data) return seedTestimonials;
  return data.map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    dogName: r.dog_name,
    quote: r.quote,
    rating: r.rating,
    photo: r.photo_url,
  }));
}

// ---------------------------------------------------------------------------
// ADMIN READS / WRITES (require an authenticated admin via RLS)
// ---------------------------------------------------------------------------

export async function fetchAllDogs(): Promise<AdminDog[]> {
  const { data, error } = await supabase.from('dogs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as DogRow[]).map(rowToAdminDog);
}

export async function fetchDogByRowId(rowId: string): Promise<AdminDog | null> {
  const { data, error } = await supabase.from('dogs').select('*').eq('id', rowId).maybeSingle();
  if (error) throw error;
  return data ? rowToAdminDog(data as DogRow) : null;
}

export async function createDog(input: DogInput): Promise<void> {
  const { error } = await supabase.from('dogs').insert(inputToRow(input));
  if (error) throw error;
}

export async function updateDog(rowId: string, input: DogInput): Promise<void> {
  const { error } = await supabase.from('dogs').update(inputToRow(input)).eq('id', rowId);
  if (error) throw error;
}

export async function deleteDog(rowId: string): Promise<void> {
  const { error } = await supabase.from('dogs').delete().eq('id', rowId);
  if (error) throw error;
}

/** Quick publish / unpublish toggle from the dogs list. */
export async function setDogPublished(rowId: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('dogs').update({ published }).eq('id', rowId);
  if (error) throw error;
}

/** Upload one file (photo or video) to storage and return its public URL. */
async function uploadDogFile(file: File, slug: string, fallbackExt: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || fallbackExt;
  const path = `${slug || 'dog'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(DOG_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(DOG_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Upload one image file to storage and return its public URL. */
export const uploadDogImage = (file: File, slug: string) => uploadDogFile(file, slug, 'jpg');

/** Upload one video file to storage and return its public URL. */
export const uploadDogVideo = (file: File, slug: string) => uploadDogFile(file, slug, 'mp4');

/** One-time helper: import the bundled demo dogs into an empty table. */
export async function importSeedDogs(): Promise<number> {
  const rows = seedDogs.map((d, i) => ({
    slug: d.id,
    name: d.name,
    breed: d.breed,
    registry: d.registry,
    weight_label: d.weightLabel,
    age_label: d.ageLabel,
    age_group: d.ageGroup,
    gender: d.gender,
    color: d.color,
    location: d.location,
    region: d.region,
    status: d.status,
    neutered: d.neutered,
    vaccinated: d.vaccinated,
    vet_checked: d.vetChecked,
    microchipped: d.microchipped,
    good_with_children: d.goodWithChildren,
    good_with_cats: d.goodWithCats,
    good_with_dogs: d.goodWithDogs,
    price: d.price,
    reserve_price: 0,
    breeding_price: 0,
    warranty_price: 0,
    coordinator_name: d.coordinator.name,
    coordinator_email: d.coordinator.email,
    coordinator_phone: d.coordinator.phone,
    personality: d.personality,
    short_description: d.shortDescription,
    story: d.story,
    images: d.images,
    videos: d.videos ?? [],
    published: true,
    // stagger timestamps so the original order is preserved
    created_at: new Date(Date.now() - (seedDogs.length - i) * 1000).toISOString(),
  }));
  const { error } = await supabase.from('dogs').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
  return rows.length;
}

// ---------------------------------------------------------------------------
// TESTIMONIALS (admin-managed)
// ---------------------------------------------------------------------------

export interface TestimonialInput {
  id?: string;
  customerName: string;
  dogName: string;
  quote: string;
  rating: number;
  photoUrl: string;
  published: boolean;
}

export async function fetchAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTestimonial(input: TestimonialInput): Promise<void> {
  const { error } = await supabase.from('testimonials').insert({
    customer_name: input.customerName,
    dog_name: input.dogName,
    quote: input.quote,
    rating: input.rating,
    photo_url: input.photoUrl,
    published: input.published,
  });
  if (error) throw error;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

export async function setTestimonialPublished(id: string, published: boolean): Promise<void> {
  const { error } = await supabase.from('testimonials').update({ published }).eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// FORM SUBMISSIONS (public insert)
// ---------------------------------------------------------------------------

export interface OrderItemInput {
  dogSlug: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
}

export async function createOrder(o: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderItemInput[];
  total: number;
}): Promise<void> {
  const { error } = await supabase.from('orders').insert({
    customer_name: o.customerName,
    email: o.email,
    phone: o.phone,
    address: o.address,
    notes: o.notes,
    items: o.items,
    total: o.total,
  });
  if (error) throw error;
}

export async function submitContact(m: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(m);
  if (error) throw error;
}

export async function submitPuppyApplication(a: {
  dogId: string;
  dogName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  homeType: string;
  hasChildren: string;
  hasPets: string;
  experience: string;
}): Promise<void> {
  const { error } = await supabase.from('puppy_applications').insert({
    dog_id: a.dogId,
    dog_name: a.dogName,
    name: a.name,
    email: a.email,
    phone: a.phone,
    address: a.address,
    home_type: a.homeType,
    has_children: a.hasChildren,
    has_pets: a.hasPets,
    experience: a.experience,
  });
  if (error) throw error;
}

export async function submitNewsletter(email: string): Promise<void> {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  if (error) throw error;
}
