'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Dog } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image-utils';
import { HeartIcon, MaleIcon, FemaleIcon, PinIcon, ArrowRightIcon } from './Icons';
import { getFavourites, toggleFavourite } from '@/lib/localStorage-utils';

const statusStyles: Record<Dog['status'], string> = {
  Available: 'bg-forest-100 text-forest-700',
  Pending: 'bg-amber-100 text-amber-700',
  Sold: 'bg-sky-100 text-sky-700',
};

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
        <span className={`badge absolute left-3 top-3 ${statusStyles[dog.status]} shadow-sm`}>{dog.status}</span>
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-extrabold text-forest-800">{dog.name}</h3>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-muted">
            {dog.gender === 'Male' ? <MaleIcon className="h-4 w-4 text-sky" /> : <FemaleIcon className="h-4 w-4 text-ember" />}
            {dog.gender}
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-muted">
          {dog.breed} · {dog.ageLabel}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted">
          <PinIcon className="h-4 w-4 text-forest-500" /> {dog.location}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/80">{dog.shortDescription}</p>

        <div className="mt-auto flex gap-2 pt-5">
          <Link href={`/dogs/${dog.id}`} className="btn-ghost flex-1 px-4 py-2.5 text-sm">
            View Details
          </Link>
          <Link
            href={`/dogs/${dog.id}#buy`}
            className={`btn-accent flex-1 px-4 py-2.5 text-sm ${dog.status === 'Sold' ? 'pointer-events-none opacity-50' : ''}`}
            aria-disabled={dog.status === 'Sold'}
          >
            Buy Now <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
