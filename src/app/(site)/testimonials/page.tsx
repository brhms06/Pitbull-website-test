import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { StarIcon } from '@/components/Icons';
import { fetchPublicTestimonialsServer } from '@/lib/db.server';

export const metadata: Metadata = { title: 'Testimonials' };

export default async function TestimonialsPage() {
  const testimonials = await fetchPublicTestimonialsServer();

  return (
    <>
      <PageHero title="Testimonials" breadcrumb="Testimonials" subtitle="What our families say about their puppies." />
      <article className="container-page py-14 md:py-20">
        {testimonials.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="card flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <img src={t.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-forest-800">{t.customerName}</p>
                    {t.dogName && <p className="text-xs text-muted">Owner of {t.dogName}</p>}
                  </div>
                </div>
                <div className="flex gap-0.5 text-ember">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink/70">No testimonials yet.</p>
        )}
      </article>
    </>
  );
}
