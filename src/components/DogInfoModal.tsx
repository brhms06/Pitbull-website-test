'use client';

import Link from 'next/link';
import type { Dog } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import Modal from './Modal';
import { CheckIcon } from './Icons';

const facts = (dog: Dog) => [
  { label: 'Breed', value: dog.breed },
  { label: 'Age', value: dog.ageLabel },
  { label: 'Gender', value: dog.gender },
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

/** Full puppy info in a modal — click anywhere except the Contact button to close it. */
export default function DogInfoModal({ dog, onClose }: { dog: Dog | null; onClose: () => void }) {
  return (
    <Modal open={!!dog} onClose={onClose} title={dog?.name} size="lg" closeOnContentClick hideCloseButton>
      {dog && (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl bg-sand/30">
            <img
              src={getOptimizedImageUrl(dog.images[0], 700, 75)}
              alt={dog.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
            {facts(dog).map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{f.label}</dt>
                <dd className="text-lg font-bold text-forest-800">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-6 border-t border-sand pt-5 sm:grid-cols-2">
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

          <Link href={`/contact?dog=${dog.id}`} className="btn-accent w-full" onClick={(e) => e.stopPropagation()}>
            Contact Us About {dog.name}
          </Link>
        </div>
      )}
    </Modal>
  );
}
