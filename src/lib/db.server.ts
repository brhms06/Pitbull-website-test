import { createClient } from './supabase/server';
import { dogs as seedDogs } from '@/data/dogs';
import { testimonials as seedTestimonials } from '@/data/testimonials';
import type { Dog, Testimonial } from '@/types';
import { rowToAdminDog, type DogRow } from './db';

/** Server-side variant of fetchPublicDogs, for use in Server Components. */
export async function fetchPublicDogsServer(): Promise<Dog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error || !data) return seedDogs;
  return (data as DogRow[]).map(rowToAdminDog);
}

export async function fetchPublicDogBySlugServer(slug: string): Promise<Dog | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) return seedDogs.find((d) => d.id === slug);
  return data ? rowToAdminDog(data as DogRow) : undefined;
}

export async function fetchPublicTestimonialsServer(): Promise<Testimonial[]> {
  const supabase = await createClient();
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
