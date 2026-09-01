'use client';

import { useMemo, useState } from 'react';
import type { Dog } from '@/types';
import DogGrid from './DogGrid';
import FilterSidebar, { defaultFilters, type DogFilters } from './FilterSidebar';

const PAGE_SIZE = 6;

export default function DogsBrowser({ dogs }: { dogs: Dog[] }) {
  const [filters, setFilters] = useState<DogFilters>(defaultFilters);
  const [page, setPage] = useState(1);

  const regions = useMemo(() => Array.from(new Set(dogs.map((d) => d.region).filter(Boolean))).sort(), [dogs]);

  const filtered = useMemo(
    () =>
      dogs.filter(
        (d) =>
          (filters.age === 'all' || d.ageGroup === filters.age) &&
          (filters.gender === 'all' || d.gender === filters.gender) &&
          (filters.region === 'all' || d.region === filters.region) &&
          (filters.status === 'all' || d.status === filters.status),
      ),
    [dogs, filters],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const applyFilters = (f: DogFilters) => {
    setFilters(f);
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside>
        <FilterSidebar regions={regions} onApply={applyFilters} resultCount={filtered.length} />
      </aside>

      <div>
        <DogGrid dogs={pageItems} />

        {pageCount > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={current === 1} className="btn-ghost px-4 py-2 text-sm disabled:opacity-40">
              Prev
            </button>
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                aria-current={current === i + 1}
                className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                  current === i + 1 ? 'bg-forest text-white shadow-soft' : 'bg-white text-forest-700 ring-1 ring-black/5 hover:bg-forest-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={current === pageCount}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
