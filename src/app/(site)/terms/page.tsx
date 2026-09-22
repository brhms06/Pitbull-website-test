import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Terms & Conditions', robots: { index: false, follow: false } };

/**
 * Terms covering puppy reservations and purchases. Written to describe how
 * the business actually operates — not legal advice. Have an attorney review
 * before relying on it, and keep the deposit and health-guarantee wording in
 * step with the written contract you issue.
 */
const sections: Array<{ h: string; p: string[] }> = [
  {
    h: 'About these terms',
    p: [`These terms apply to your use of the ${site.name} website and to any puppy reserved or purchased through it. By placing a reservation you agree to them.`],
  },
  {
    h: 'Responsibilities of the buyer',
    p: [
      'Payment: The buyer is responsible for paying for the puppy and shipping fees.',
      'Supervision: The buyer agrees to provide proper supervision and not allow the puppy outdoors without supervision.',
      'Humane care: The buyer commits to caring for the puppy in a humane manner, including providing adequate food, water, shelter, attention and medical care.',
      'Guarantee and liability: The buyer understands that the breeder provides guarantees about the puppy’s temperament but is not responsible for future damages or injuries caused by the puppy.',
      'Monitoring: The breeder has permission to contact the buyer to ensure the puppy is being properly treated and cared for.',
    ],
  },
  {
    h: "Seller's guarantees",
    p: [
      'Health and registration: The seller guarantees the puppy’s sound health and provides AKC registration application paperwork for local Kennel Club registration.',
      'Temperament: The seller ensures that the puppy has a great temperament at the time of sale.',
      'Health records: The seller provides a health record of all shots and worming.',
    ],
  },
  {
    h: 'Physical examination and refund',
    p: [
      'Veterinary examination: The buyer agrees to take the puppy to a licensed veterinarian within 72 hours of delivery for a physical examination.',
      'Refund policy: If the licensed vet determines that the puppy has health issues caused by the seller, the buyer can return the puppy for a full refund, with the seller covering the return expenses.',
    ],
  },
  {
    h: "Buyer's options and responsibilities",
    p: [
      'Rehoming option: If the buyer needs to give up the dog, the seller should be notified first, giving them the first option to resume full ownership and find a new home for the dog.',
      'Money-back guarantee: The buyer has a 30-day money-back guarantee, with a full refund if they are not satisfied with the dog or have difficulties bonding with it.',
      'Transfer approval: The breeder/seller reserves the right to approve or prohibit any transfer of the animal to a third party.',
      'Prohibited facilities: The dog should not be sold, leased, traded or given to any pet shop, research laboratory, animal shelter or similar facility.',
    ],
  },
  {
    h: 'Website content',
    p: [
      'Photographs, text and other material on this site belong to us and may not be reproduced without permission.',
      'We aim to keep availability and pricing accurate but the site may occasionally be out of date; we will always confirm the current position before taking payment.',
    ],
  },
  {
    h: 'Contact',
    p: [`Questions about these terms? Email us at ${site.email} or call ${site.phone}.`],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" breadcrumb="Terms" subtitle="The terms covering puppy reservations and use of this website." />
      <article className="container-page max-w-3xl py-14 md:py-20">
        <p className="text-sm text-muted">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        {sections.map((s) => (
          <section key={s.h} className="mt-8">
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
