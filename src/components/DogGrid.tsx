import type { Dog } from '@/types';
import DogCard from './DogCard';
import Reveal from './Reveal';
import { PawIcon } from './Icons';

interface Props {
  dogs: Dog[];
  /** Optional message shown when the list is empty. */
  emptyMessage?: string;
}

export default function DogGrid({ dogs, emptyMessage }: Props) {
  if (dogs.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <PawIcon className="h-12 w-12 text-forest-300" />
        <p className="text-lg font-semibold text-forest-800">{emptyMessage ?? 'No puppies currently available — check back soon!'}</p>
        <p className="max-w-md text-sm text-muted">
          New litters arrive regularly. Follow us on social media or subscribe to our newsletter to be the first to know.
        </p>
      </div>
    );
  }

  return (
    <Reveal stagger={0.08} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dogs.map((dog) => (
        <DogCard key={dog.id} dog={dog} />
      ))}
    </Reveal>
  );
}
