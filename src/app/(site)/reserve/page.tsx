import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PuppyApplicationForm from '@/components/PuppyApplicationForm';
import { fetchPublicDogsServer } from '@/lib/db.server';

const heroImg = 'https://placedog.net/1400/700?id=95';

export const metadata: Metadata = {
  title: 'Reserve a Puppy',
  description: 'Start your reservation for an American Bully puppy — pick the puppy you love and tell us about your home in a few short steps.',
};

export default async function ReservePage() {
  const dogs = await fetchPublicDogsServer();
  const reservable = dogs.filter((d) => d.status !== 'Sold').map((d) => ({ id: d.id, name: d.name }));

  return (
    <>
      <PageHero
        title="Reserve a Puppy"
        subtitle="Pick the puppy you're interested in and tell us a little about your home — we'll be in touch within 24 hours."
        image={heroImg}
      />
      <section className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {reservable.length > 0 ? (
            <PuppyApplicationForm dogs={reservable} />
          ) : (
            <p className="card p-8 text-center text-muted">
              We don&apos;t have any puppies available to reserve right now — check back soon, or browse our full litter list.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
