'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllDogs, deleteDog, importSeedDogs, setDogPublished, type AdminDog } from '@/lib/db';
import { ArrowRightIcon, PawIcon } from '@/components/Icons';

const statusStyles: Record<string, string> = {
  Available: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Sold: 'bg-sky-100 text-sky-700',
};

export default function DogsAdminPage() {
  const [dogs, setDogs] = useState<AdminDog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setDogs(await fetchAllDogs());
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load puppies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (dog: AdminDog) => {
    if (!window.confirm(`Delete "${dog.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteDog(dog.rowId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (dog: AdminDog) => {
    setBusy(true);
    try {
      await setDogPublished(dog.rowId, !dog.published);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not change visibility.');
    } finally {
      setBusy(false);
    }
  };

  const onImport = async () => {
    setBusy(true);
    try {
      await importSeedDogs();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-forest-800">Puppies</h1>
          <p className="mt-1 text-muted">
            {loading ? 'Loading…' : `${dogs.length} listing${dogs.length === 1 ? '' : 's'}`} — published puppies appear on the live site.
          </p>
        </div>
        <Link href="/admin/dogs/new" className="btn-primary">
          Add a puppy <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-sand/50" />
          ))}
        </div>
      ) : dogs.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center gap-4 px-6 py-16 text-center">
          <PawIcon className="h-12 w-12 text-forest-300" />
          <p className="text-lg font-semibold text-forest-800">No puppies yet</p>
          <p className="max-w-md text-sm text-muted">Add your first puppy, or import the sample puppies to get started quickly. You can edit or delete them afterwards.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/admin/dogs/new" className="btn-primary">
              Add a puppy
            </Link>
            <button type="button" onClick={onImport} disabled={busy} className="btn-ghost disabled:opacity-60">
              {busy ? 'Importing…' : 'Import sample puppies'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-sand bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand/50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Puppy</th>
                <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                <th className="px-4 py-3">Live</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {dogs.map((dog) => (
                <tr key={dog.rowId} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={dog.images[0] || 'https://placehold.co/80x80?text=Dog'} alt={dog.name} className="h-12 w-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-forest-800">{dog.name}</p>
                        <p className="text-xs text-muted">
                          {dog.ageLabel} · {dog.gender}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className={`badge ${statusStyles[dog.status] ?? 'bg-sand text-muted'}`}>{dog.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => togglePublish(dog)}
                      disabled={busy}
                      title={dog.published ? 'Tap to hide from the website' : 'Tap to publish to the website'}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-60 ${
                        dog.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-ember text-white hover:bg-ember-600'
                      }`}
                    >
                      {dog.published ? 'Live ✓' : 'Publish'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link href={`/admin/dogs/${dog.rowId}/edit`} className="btn-ghost px-3 py-1.5 text-xs">
                        Edit
                      </Link>
                      <button type="button" onClick={() => onDelete(dog)} disabled={busy} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
