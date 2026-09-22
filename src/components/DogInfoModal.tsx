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

const checklist = (dog: Dog) => [
  { label: 'Vet-checked', ok: dog.vetChecked },
  { label: 'Vaccinated', ok: dog.vaccinated },
  { label: 'Neutered/spayed', ok: dog.neutered },
  { label: 'Microchipped', ok: dog.microchipped },
  { label: 'Good with children', ok: dog.goodWithChildren },
  { label: 'Good with cats', ok: dog.goodWithCats },
  { label: 'Good with dogs', ok: dog.goodWithDogs },
];

/** Full puppy info in a modal, side-by-side so it fits without scrolling — click anywhere except the Contact button to close it. */
export default function DogInfoModal({ dog, onClose }: { dog: Dog | null; onClose: () => void }) {
  return (
    <Modal open={!!dog} onClose={onClose} title={dog?.name} size="lg" closeOnContentClick hideCloseButton>
      {dog && (
        <div className="flex gap-3 sm:gap-5">
          <div className="w-28 shrink-0 self-start overflow-hidden rounded-xl bg-sand/30 sm:w-40 sm:rounded-2xl md:w-48">
            <img
              src={getOptimizedImageUrl(dog.images[0], 400, 75)}
              alt={dog.name}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <dl className="grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2">
              {facts(dog).map((f) => (
                <div key={f.label}>
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:text-xs">{f.label}</dt>
                  <dd className="text-sm font-bold text-forest-800 sm:text-base">{f.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="grid grid-cols-1 gap-x-3 gap-y-1 border-t border-sand pt-2 sm:grid-cols-2">
              {checklist(dog).filter((f) => f.ok).map((f) => (
                <li key={f.label} className="flex items-center gap-1.5 text-[11px] text-ink/80 sm:text-xs">
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 text-forest" /> {f.label}
                </li>
              ))}
            </ul>

            <Link
              href={`/contact?dog=${dog.id}`}
              className="btn-accent mt-auto w-full !py-2.5 text-sm sm:text-base"
              onClick={(e) => e.stopPropagation()}
            >
              Contact Us About {dog.name}
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
