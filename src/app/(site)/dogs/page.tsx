import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import DogsBrowser from '@/components/DogsBrowser';
import { site } from '@/data/site';
import { fetchPublicDogsServer } from '@/lib/db.server';
import { pitbullPhotos } from '@/data/pitbullPhotos';

const heroImg = pitbullPhotos[2];

export const metadata: Metadata = {
  title: 'Available Pitbull Puppies',
  description: 'Browse available Pitbull puppies — vet-checked, vaccinated and home-raised. Reserve yours today, with nationwide delivery.',
};

export default async function DogsPage() {
  const dogs = await fetchPublicDogsServer();

  const itemListSchema =
    dogs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: dogs.map((dog, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${site.url}/dogs/${dog.id}`,
            name: dog.name,
            image: dog.images?.[0] || '',
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Available Puppies', item: `${site.url}/dogs` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema ? [itemListSchema, breadcrumbJsonLd] : breadcrumbJsonLd) }}
      />
      <PageHero title="Available Pitbull Puppies" subtitle="Browse our available puppies — vet-checked, vaccinated and ready for their new homes. Nationwide delivery available." image={heroImg} />

      <section className="container-page py-12 md:py-16">
        <DogsBrowser dogs={dogs} />
      </section>
    </>
  );
}
