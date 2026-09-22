'use client';

import { motion } from 'framer-motion';
import type { Dog } from '@/types';
import { getOptimizedImageUrl } from '@/lib/image-utils';

/** Compact photo + name card for the homepage preview grid — full info opens in a modal, not a page. */
export default function DogPreviewCard({ dog, onOpen }: { dog: Dog; onOpen: (dog: Dog) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(dog)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card group flex w-full flex-col overflow-hidden text-left hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-sand/30">
        <img
          src={getOptimizedImageUrl(dog.images[0], 400, 70)}
          alt={dog.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-3 text-center">
        <p className="truncate font-heading font-bold text-forest-800">{dog.name}</p>
      </div>
    </motion.button>
  );
}
