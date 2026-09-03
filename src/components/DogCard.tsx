'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Dog } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { HeartIcon, PawIcon } from './Icons';
import { getFavourites, toggleFavourite } from '@/lib/localStorage-utils';

const details = (dog: Dog) => [
  { label: 'Condition', value: dog.status },
  { label: 'Sex', value: dog.gender },
  { label: 'Age', value: dog.ageLabel },
  { label: 'Breed', value: dog.breed },
];

export default function DogCard({ dog }: { dog: Dog }) {
  const [fav, setFav] = useState(() => getFavourites().includes(dog.id));

  const onFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavourite(dog.id).includes(dog.id));
  };

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card group flex h-full flex-col overflow-hidden hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/dogs/${dog.id}`} aria-label={`View ${dog.name}`}>
          <img
            src={getOptimizedImageUrl(dog.images[0], 500, 70)}
            alt={`${dog.name}, a ${dog.color} ${dog.breed}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <button
          type="button"
          onClick={onFav}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${dog.name} from favourites` : `Add ${dog.name} to favourites`}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ember shadow-sm backdrop-blur transition hover:scale-110"
        >
          <HeartIcon filled={fav} className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-extrabold text-forest-800">
          Name: {dog.name} <span className="text-muted">|</span> <span className="text-ember">${dog.price.toLocaleString()}</span>
        </h3>

        <ul className="mt-3 space-y-1.5">
          {details(dog).map(({ label, value }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-ink/80">
              <PawIcon className="h-4 w-4 shrink-0 text-ember" />
              {label}: {value}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <Link href={`/contact?dog=${dog.id}`} className="btn-accent w-full">
            Contact Us Now!
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
