'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { fetchAllTestimonials, createTestimonial, deleteTestimonial, setTestimonialPublished } from '@/lib/db';
import { StarIcon } from '@/components/Icons';

interface TestimonialRow {
  id: string;
  customer_name: string;
  quote: string;
  rating: number;
  published: boolean;
  created_at: string;
}

const empty = { customerName: '', quote: '', rating: 5, published: true };

/** Clickable 1-5 star picker — hover previews the rating, click sets it. */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5 transition hover:scale-110"
        >
          <StarIcon className={`h-7 w-7 ${(hover || value) >= n ? 'text-ember' : 'text-sand'}`} />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsAdminPage() {
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setRows((await fetchAllTestimonials()) as TestimonialRow[]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.quote.trim()) return;
    setSaving(true);
    try {
      await createTestimonial(form);
      setForm(empty);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    load();
  };

  const togglePublish = async (row: TestimonialRow) => {
    await setTestimonialPublished(row.id, !row.published);
    load();
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-forest-800">Testimonials</h1>
      <p className="mt-1 text-muted">Published testimonials appear on the Home and Testimonials pages.</p>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-5 p-6">
        <label className="block">
          <span className="label">Customer name</span>
          <input
            className="input"
            placeholder="e.g. The Ramirez Family"
            value={form.customerName}
            onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
          />
        </label>

        <div>
          <span className="label">Rating</span>
          <StarPicker value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
        </div>

        <label className="block">
          <span className="label">Testimonial</span>
          <textarea
            rows={4}
            className="input"
            placeholder="What did they say about their puppy?"
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
          />
        </label>

        <div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? 'Saving…' : 'Add testimonial'}
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-sand/50" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="card mt-6 px-6 py-12 text-center text-muted">No testimonials yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="card flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="font-bold text-forest-800">{row.customer_name}</p>
                <div className="mt-1 flex gap-0.5 text-ember">
                  {Array.from({ length: row.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-2 text-sm text-ink/80">&ldquo;{row.quote}&rdquo;</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(row)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${row.published ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-ember text-white hover:bg-ember-600'}`}
                >
                  {row.published ? 'Live ✓' : 'Publish'}
                </button>
                <button type="button" onClick={() => onDelete(row.id)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
