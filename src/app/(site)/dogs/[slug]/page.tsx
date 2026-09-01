import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DogGallery from '@/components/DogGallery';
import ShareButton from '@/components/ShareButton';
import { CheckIcon, FemaleIcon, MaleIcon, PinIcon, MailIcon, PhoneIcon } from '@/components/Icons';
import PurchasePanel from '@/components/PurchasePanel';
import PuppyApplicationForm from '@/components/PuppyApplicationForm';
import { fetchPublicDogBySlugServer } from '@/lib/db.server';
import { site } from '@/data/site';
import { dogFaqs } from '@/data/dogFaqs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dog = await fetchPublicDogBySlugServer(slug);
  if (!dog) return { title: 'Puppy Not Found' };

  const title = `${dog.name} — ${dog.color} ${dog.breed}`;
  const description = dog.shortDescription || `Meet ${dog.name}, a ${dog.color} ${dog.breed} available now.`;
  return {
    title,
    description,
    openGraph: { title, description, images: dog.images[0] ? [dog.images[0]] : undefined },
  };
}

export default async function DogDetailPage({ params }: Props) {
  const { slug } = await params;
  const dog = await fetchPublicDogBySlugServer(slug);

  if (!dog) notFound();

  const hasCoordinator = Boolean(dog.coordinator.name || dog.coordinator.email || dog.coordinator.phone);

  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${dog.name} — ${dog.color} ${dog.breed}`,
    description: dog.shortDescription || dog.story,
    image: dog.images,
    category: dog.breed,
    offers: {
      '@type': 'Offer',
      price: dog.price,
      priceCurrency: 'USD',
      url: `${site.url}/dogs/${dog.id}`,
      availability: dog.status === 'Sold' ? 'https://schema.org/SoldOut' : dog.status === 'Pending' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
    },
  };

  const faqs = dogFaqs[dog.id] || [];
  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
        }
      : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Available Puppies', item: `${site.url}/dogs` },
      { '@type': 'ListItem', position: 3, name: dog.name, item: `${site.url}/dogs/${dog.id}` },
    ],
  };

  const jsonLdData = faqJsonLd ? [productJsonLd, breadcrumbJsonLd, faqJsonLd] : [productJsonLd, breadcrumbJsonLd];

  const facts: Array<[string, string]> = [
    ['Breed', dog.breed],
    ['Age', dog.ageLabel],
    ['Gender', dog.gender],
    ['Color', dog.color],
    ['Weight', dog.weightLabel],
    ['Price', `$${dog.price}`],
  ];

  const health = [
    ['Vet-checked', dog.vetChecked],
    ['Vaccinated', dog.vaccinated],
    ['Neutered', dog.neutered],
    ['Microchipped', dog.microchipped],
  ] as const;

  const livesWith = [
    ['Children', dog.goodWithChildren],
    ['Other dogs', dog.goodWithDogs],
    ['Cats', dog.goodWithCats],
  ] as const;

  return (
    <div className="container-page py-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
      <nav className="mb-6 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/" className="link-quiet">
          Home
        </Link>{' '}
        /{' '}
        <Link href="/dogs" className="link-quiet">
          Puppies
        </Link>{' '}
        / <span className="font-semibold text-forest-800">{dog.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <DogGallery images={dog.images} name={dog.name} color={dog.color} breed={dog.breed} />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold text-forest-800">{dog.name}</h1>
            <span className="inline-flex items-center gap-1 text-muted">
              {dog.gender === 'Male' ? <MaleIcon className="h-5 w-5 text-sky" /> : <FemaleIcon className="h-5 w-5 text-ember" />}
              {dog.gender}
            </span>
          </div>
          <p className="mt-2 text-muted">
            {dog.breed}
            {dog.registry ? ` · ${dog.registry} registered` : ''}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-muted">
            <PinIcon className="h-4 w-4 text-forest-500" /> {dog.location}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {dog.personality.map((p) => (
              <span key={p} className="badge bg-forest-50 text-forest-700">
                {p}
              </span>
            ))}
          </div>

          <p className="mt-5 leading-relaxed text-ink/85">{dog.story}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            {facts.map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-sand/60 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
                <dd className="font-bold text-forest-800">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <PurchasePanel dog={dog} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#apply" className="btn-ghost text-sm">
              Have a question? Send an inquiry
            </a>
            <ShareButton name={dog.name} />
          </div>
        </div>
      </div>

      {dog.videos && dog.videos.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-forest-800">Watch {dog.name}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {dog.videos.map((url) => (
              <video key={url} src={url} controls playsInline preload="metadata" className="w-full rounded-3xl bg-ink/5 shadow-soft ring-1 ring-black/5" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-extrabold text-forest-800">Health &amp; care</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {health.map(([label, ok]) => (
              <li key={label} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${ok ? 'bg-forest-100 text-forest-700' : 'bg-sand text-muted'}`}>
                  {ok ? <CheckIcon className="h-4 w-4" /> : '–'}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-extrabold text-forest-800">Lives happily with</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {livesWith.map(([label, ok]) => (
              <li key={label} className="flex items-center gap-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${ok ? 'bg-forest-100 text-forest-700' : 'bg-sand text-muted'}`}>
                  {ok ? <CheckIcon className="h-4 w-4" /> : '–'}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className={`card p-6 ${hasCoordinator ? 'md:col-span-2' : 'md:col-span-3'}`}>
          <h2 className="text-lg font-extrabold text-forest-800">Reservation &amp; pickup</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/85">
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 text-forest" /> A deposit reserves your puppy until pickup
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 text-forest" /> Full health records, vaccinations &amp; a health guarantee
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 text-forest" /> Ready to go home once old enough to travel safely
            </li>
            <li className="flex items-start gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 text-forest" /> Local pickup or nationwide delivery
            </li>
          </ul>
        </div>
        {hasCoordinator && (
          <div className="card p-6">
            <h2 className="text-lg font-extrabold text-forest-800">{dog.name}&apos;s coordinator</h2>
            {dog.coordinator.name && <p className="mt-3 font-semibold text-forest-700">{dog.coordinator.name}</p>}
            {dog.coordinator.email && (
              <a href={`mailto:${dog.coordinator.email}`} className="mt-2 flex items-center gap-2 text-sm link-quiet">
                <MailIcon className="h-4 w-4" /> {dog.coordinator.email}
              </a>
            )}
            {dog.coordinator.phone && (
              <a href={`tel:${dog.coordinator.phone.replace(/\s/g, '')}`} className="mt-1 flex items-center gap-2 text-sm link-quiet">
                <PhoneIcon className="h-4 w-4" /> {dog.coordinator.phone}
              </a>
            )}
          </div>
        )}
      </div>

      {faqs.length > 0 && (
        <div className="mt-16 border-t border-forest-100 pt-12">
          <h2 className="text-2xl font-extrabold text-forest-800">Frequently Asked Questions about {dog.name}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card p-6">
                <h3 className="text-base font-extrabold text-forest-700">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="apply" className="mt-14 scroll-mt-24">
        <h2 className="text-2xl font-extrabold text-forest-800">Inquire about {dog.name}</h2>
        <p className="mt-2 max-w-2xl text-muted">Fill in the short form below and we&apos;ll be in touch within 24 hours to arrange your reservation.</p>
        <div className="mt-6 max-w-3xl">
          <PuppyApplicationForm dogId={dog.id} dogName={dog.name} />
        </div>
      </div>
    </div>
  );
}
