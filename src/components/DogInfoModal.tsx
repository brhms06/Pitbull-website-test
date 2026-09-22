'use client';

import Link from 'next/link';
import type { Dog } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { dogFaqs } from '@/data/dogFaqs';
import Modal from './Modal';
import { CheckIcon, PawIcon } from './Icons';

const facts = (dog: Dog) => [
  { label: 'Breed', value: dog.breed },
  { label: 'Age', value: dog.ageLabel },
  { label: 'Gender', value: dog.gender },
  { label: 'Color', value: dog.color },
  { label: 'Weight', value: dog.weightLabel },
  { label: 'Price', value: `$${dog.price.toLocaleString()}` },
];

const healthFlags = (dog: Dog) => [
  { label: 'Vet-checked', ok: dog.vetChecked },
  { label: 'Vaccinated', ok: dog.vaccinated },
  { label: 'Neutered/spayed', ok: dog.neutered },
  { label: 'Microchipped', ok: dog.microchipped },
];

const goodWithFlags = (dog: Dog) => [
  { label: 'Children', ok: dog.goodWithChildren },
  { label: 'Cats', ok: dog.goodWithCats },
  { label: 'Other dogs', ok: dog.goodWithDogs },
];

/** Full puppy info in a modal — the site retired its per-puppy detail page, so this is the "full info" surface now. */
export default function DogInfoModal({ dog, onClose }: { dog: Dog | null; onClose: () => void }) {
  const faqs = dog ? dogFaqs[dog.id] : undefined;

  return (
    <Modal open={!!dog} onClose={onClose} title={dog?.name} size="lg">
      {dog && (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-sand/30">
            <img
              src={getOptimizedImageUrl(dog.images[0], 700, 75)}
              alt={dog.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {dog.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {dog.images.slice(1).map((src, i) => (
                <img
                  key={src + i}
                  src={getOptimizedImageUrl(src, 200, 70)}
                  alt={`${dog.name}, photo ${i + 2}`}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          {dog.personality.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dog.personality.map((trait) => (
                <span key={trait} className="badge bg-ember-100 text-ember-700">
                  <PawIcon className="h-3.5 w-3.5" /> {trait}
                </span>
              ))}
            </div>
          )}

          {dog.story && <p className="leading-relaxed text-ink/85">{dog.story}</p>}

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            {facts(dog).map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{f.label}</dt>
                <dd className="font-semibold text-forest-800">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="font-heading font-bold text-forest-800">Health &amp; care</h4>
              <ul className="mt-2 space-y-1.5">
                {healthFlags(dog).filter((f) => f.ok).map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckIcon className="h-4 w-4 shrink-0 text-forest" /> {f.label}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold text-forest-800">Good with</h4>
              <ul className="mt-2 space-y-1.5">
                {goodWithFlags(dog).filter((f) => f.ok).map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckIcon className="h-4 w-4 shrink-0 text-forest" /> {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {dog.coordinator?.name && (
            <div className="rounded-2xl bg-sand/30 p-4 text-sm">
              <p className="font-semibold text-forest-800">Adoption coordinator</p>
              <p className="text-ink/80">{dog.coordinator.name}</p>
              {dog.coordinator.email && <p className="text-ink/80">{dog.coordinator.email}</p>}
              {dog.coordinator.phone && <p className="text-ink/80">{dog.coordinator.phone}</p>}
            </div>
          )}

          {faqs && faqs.length > 0 && (
            <div>
              <h4 className="font-heading font-bold text-forest-800">Frequently asked questions</h4>
              <div className="mt-2 space-y-3">
                {faqs.map((f) => (
                  <div key={f.question}>
                    <p className="font-semibold text-ink">{f.question}</p>
                    <p className="text-sm text-ink/75">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href={`/contact?dog=${dog.id}`} className="btn-accent w-full">
            Contact Us About {dog.name}
          </Link>
        </div>
      )}
    </Modal>
  );
}
