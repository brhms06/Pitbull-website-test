'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl } from '@/lib/image-utils';

export default function DogGallery({ images, name, color, breed }: { images: string[]; name: string; color: string; breed: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <motion.div
        key={active}
        initial={{ opacity: 0.4, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-black/5"
      >
        <img src={getOptimizedImageUrl(images[active], 800, 80)} alt={`${name}, a ${color} ${breed}`} className="aspect-[4/3] w-full object-cover" />
      </motion.div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-2xl ring-2 transition ${active === i ? 'ring-forest' : 'ring-transparent opacity-70 hover:opacity-100'}`}
              aria-label={`View photo ${i + 1}`}
            >
              <img src={getOptimizedImageUrl(src, 150, 60)} alt={`${name} photo thumbnail ${i + 1}`} className="h-20 w-24 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
