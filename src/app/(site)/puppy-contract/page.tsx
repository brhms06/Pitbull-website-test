import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PuppyContractForm from '@/components/PuppyContractForm';
import { fetchPublicDogsServer } from '@/lib/db.server';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Puppy Contract', robots: { index: false, follow: false } };

/**
 * Draft pulled from the "Reserving a puppy" / "Prices, deposits and payment" /
 * "Health guarantee" / "Your responsibilities as an owner" / "Liability"
 * sections of /terms, reframed as a standalone puppy contract. Not legal
 * advice — have an attorney review before relying on it, and keep this in
 * step with the written contract you issue at sale.
 */
const sections: Array<{ h: string; p: string[] }> = [
  {
    h: 'Reserving a puppy',
    p: [
      'A puppy is reserved once we have confirmed availability and received your deposit. Until we confirm in writing, a puppy remains available to other buyers.',
      'We hold a puppy for 48 hours pending payment. If payment is not received in that window the puppy may be released to the next enquiry.',
      'We reserve the right to decline a sale where we do not believe the placement is right for the puppy.',
    ],
  },
  {
    h: 'Prices, deposits and payment',
    p: [
      "Prices are shown in US dollars on each puppy's page. Deposits are deducted from the final balance.",
      'Deposits secure a specific puppy and are non-refundable if you change your mind, except as set out in our Return & Refund Policy.',
      'The balance is due before the puppy travels. We will confirm accepted payment methods when you reserve.',
    ],
  },
  {
    h: 'Health guarantee',
    p: [
      'Every puppy leaves us vet-checked, vaccinated appropriately for its age, dewormed and microchipped, with its records supplied.',
      'We provide a written health guarantee against congenital defects with each puppy. The guarantee document issued with your puppy sets out its exact scope and duration and takes precedence over this summary.',
      'We ask that you have your puppy examined by your own vet within 72 hours of arrival so that any concern is identified straight away.',
    ],
  },
  {
    h: 'Your responsibilities as an owner',
    p: [
      'By buying from us you agree to provide appropriate food, shelter, training and veterinary care for the life of the dog, and to supervise your puppy rather than leaving them outside unattended.',
      'If you are ever unable to keep your dog, we ask that you contact us first — we would rather take a dog back than see it rehomed through a shelter, pet shop or research facility.',
      'We reserve the right to approve or decline any transfer of the dog to a third party.',
      'We may check in with you from time to time after the sale to confirm your puppy is being properly cared for.',
    ],
  },
  {
    h: 'Liability',
    p: [
      'We share known health, lineage and temperament information in good faith. Dogs are living animals and no breeder can guarantee future health or personality beyond the written guarantee provided.',
      'Once your puppy goes home with you, you are responsible for their care and behavior — we are not liable for any damage or injury your dog causes after the sale.',
    ],
  },
  {
    h: 'Contact',
    p: [`Questions about this contract? Email us at ${site.email} or call ${site.phone}.`],
  },
];

export default async function PuppyContractPage() {
  const dogs = await fetchPublicDogsServer();
  const reservable = dogs.filter((d) => d.status !== 'Sold').map((d) => ({ id: d.id, name: d.name, price: d.price }));

  return (
    <>
      <PageHero title="Puppy Contract" breadcrumb="Puppy Contract" subtitle="What to expect when you reserve and buy a puppy from us." />
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

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-forest-800">Sign this contract</h2>
          <p className="mt-3 leading-relaxed text-ink/85">
            Ready to move forward? Fill in your details, review the terms above and sign below — we&apos;ll email you and our team a copy.
          </p>
          <div className="mt-6">
            <PuppyContractForm dogs={reservable} />
          </div>
        </section>
      </article>
    </>
  );
}
