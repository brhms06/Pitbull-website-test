'use client';

import { useState } from 'react';
import type { Dog } from '@/types';
import DogPreviewCard from './DogPreviewCard';
import DogInfoModal from './DogInfoModal';

/** Client wrapper so the async homepage server component can still open a puppy-info modal on click. */
export default function AvailablePuppiesPreview({ dogs }: { dogs: Dog[] }) {
  const [selected, setSelected] = useState<Dog | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
        {dogs.map((dog) => (
          <DogPreviewCard key={dog.id} dog={dog} onOpen={setSelected} />
        ))}
      </div>
      <DogInfoModal dog={selected} onClose={() => setSelected(null)} />
    </>
  );
}
