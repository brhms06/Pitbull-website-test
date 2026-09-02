import { supabase, DOG_IMAGES_BUCKET, BLOG_IMAGES_BUCKET } from './supabase/client';
import { dogs as seedDogs } from '@/data/dogs';
import { testimonials as seedTestimonials } from '@/data/testimonials';
import { blogPosts as seedBlogPosts, type BlogPost } from '@/data/blog';
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

// ---------------------------------------------------------------------------
// BLOG POSTS (admin-managed CMS)
// ---------------------------------------------------------------------------

/** Shape of a row in the `blog_posts` table (snake_case). */
export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_json: unknown[];
  content_html: string;
  featured_image: string;
  og_image: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  author: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Editable blog post fields used by the admin form. `id` is the row uuid (edit only). */
export interface BlogPostInput {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  contentJson: unknown[];
  contentHtml: string;
  featuredImage: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  author: string;
  published: boolean;
  /** First-publish timestamp — set once by the form, then carried forward unchanged. */
  publishedAt: string | null;
}

/** A blog post with its admin metadata (db uuid + block content) attached. */
export interface AdminBlogPost {
  rowId: string;
  slug: string;
  title: string;
  excerpt: string;
  contentJson: unknown[];
  contentHtml: string;
  featuredImage: string;
  ogImage: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  author: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export const rowToAdminBlogPost = (r: BlogPostRow): AdminBlogPost => ({
  rowId: r.id,
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  contentJson: r.content_json ?? [],
  contentHtml: r.content_html,
  featuredImage: r.featured_image,
  ogImage: r.og_image,
  metaTitle: r.meta_title,
  metaDescription: r.meta_description,
  tags: r.tags ?? [],
  author: r.author,
  published: r.published,
  publishedAt: r.published_at,
  createdAt: r.created_at,
});

/** Maps a DB row to the public-facing `BlogPost` shape used by the site's blog pages. */
export const rowToBlogPost = (r: BlogPostRow): BlogPost => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  date: r.published_at ?? r.created_at,
  author: r.author,
  excerpt: r.excerpt,
  content: r.content_html,
  image: r.featured_image,
  published: r.published,
});

const inputToBlogRow = (p: BlogPostInput) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content_json: p.contentJson,
  content_html: p.contentHtml,
  featured_image: p.featuredImage,
  og_image: p.ogImage,
  meta_title: p.metaTitle,
  meta_description: p.metaDescription,
  tags: p.tags,
  author: p.author,
  published: p.published,
  published_at: p.publishedAt,
});

// ---- PUBLIC READS ----

export async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error || !data) {
    console.warn('[db] falling back to seed blog posts:', error?.message);
    return seedBlogPosts.filter((p) => p.published);
  }
  return (data as BlogPostRow[]).map(rowToBlogPost);
}

export async function fetchPublishedBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).maybeSingle();

  if (error) return seedBlogPosts.find((p) => p.slug === slug);
  return data ? rowToBlogPost(data as BlogPostRow) : undefined;
}

// ---- ADMIN READS / WRITES ----

export async function fetchAllBlogPosts(): Promise<AdminBlogPost[]> {
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as BlogPostRow[]).map(rowToAdminBlogPost);
}

export async function fetchBlogPostByRowId(rowId: string): Promise<AdminBlogPost | null> {
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', rowId).maybeSingle();
  if (error) throw error;
  return data ? rowToAdminBlogPost(data as BlogPostRow) : null;
}

export async function createBlogPost(input: BlogPostInput): Promise<void> {
  const { error } = await supabase.from('blog_posts').insert(inputToBlogRow(input));
  if (error) throw error;
}

export async function updateBlogPost(rowId: string, input: BlogPostInput): Promise<void> {
  const { error } = await supabase.from('blog_posts').update(inputToBlogRow(input)).eq('id', rowId);
  if (error) throw error;
}

export async function deleteBlogPost(rowId: string): Promise<void> {
  const { error } = await supabase.from('blog_posts').delete().eq('id', rowId);
  if (error) throw error;
}

/** Quick publish / unpublish toggle from the blog list. Stamps `published_at` the first time a post goes live. */
export async function setBlogPostPublished(rowId: string, published: boolean, publishedAt: string | null): Promise<void> {
  const { error } = await supabase
    .from('blog_posts')
    .update({ published, published_at: publishedAt ?? (published ? new Date().toISOString() : null) })
    .eq('id', rowId);
  if (error) throw error;
}

/** Upload one blog content/featured image to storage and return its public URL. */
export async function uploadBlogImage(file: File, slug: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${slug || 'post'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BLOG_IMAGES_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BLOG_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** One-time helper: import the bundled demo blog posts into an empty table. */
export async function importSeedBlogPosts(): Promise<number> {
  const rows = seedBlogPosts.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content_json: [],
    content_html: p.content,
    featured_image: p.image,
    og_image: '',
    meta_title: '',
    meta_description: '',
    tags: [],
    author: p.author,
    published: p.published,
    published_at: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
    created_at: new Date(Date.now() - (seedBlogPosts.length - i) * 1000).toISOString(),
  }));
  const { error } = await supabase.from('blog_posts').upsert(rows, { onConflict: 'slug' });
  if (error) throw error;
  return rows.length;
}
