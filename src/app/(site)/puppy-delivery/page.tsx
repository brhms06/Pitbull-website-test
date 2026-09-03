import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Puppy Delivery' };

const sections: Array<{ h: string; p: string[] }> = [
  {
    h: 'How delivery works',
    p: [
      'We offer three ways to bring your puppy home, and we\'ll help you choose the right one when you reserve:',
      '• Ground transport — nationwide door-to-door delivery by pet-experienced transporters.',
      '• Flight nanny — a dedicated escort flies with your puppy on a commercial flight and hands them to you at the airport.',
      '• Local or airport pickup — collect your puppy in person, or meet us at a nearby airport.',
    ],
  },
  {
    h: 'Delivery areas & cost',
    p: [
      'We deliver across the US. Cost depends on your location and the method you choose, so contact us for a quote once you\'ve reserved a puppy.',
    ],
  },
  {
    h: 'Preparing for arrival',
    p: [
      'Every puppy is vet-checked, vaccinated appropriately for their age and dewormed before they travel — we never send a puppy that isn\'t ready or healthy enough for the trip.',
      `You'll receive vet exam, vaccination and deworming records along with your puppy. Questions before or after delivery? Email us at ${site.email} or call ${site.phone}.`,
    ],
  },
];

export default function PuppyDeliveryPage() {
  return (
    <>
      <PageHero title="Puppy Delivery" breadcrumb="Puppy Delivery" subtitle="How we get your puppy safely to your door." />
      <article className="container-page max-w-3xl py-14 md:py-20">
        {sections.map((s) => (
          <section key={s.h} className="mt-8 first:mt-0">
            <h2 className="text-2xl font-extrabold text-forest-800">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink/85">
                {para}
              </p>
            ))}
          </section>
        ))}
      </article>
    </>
  );
}
