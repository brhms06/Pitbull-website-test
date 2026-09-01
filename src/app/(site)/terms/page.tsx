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
      'Deposits secure a specific puppy and are non-refundable if you change your mind, except as set out under "If something goes wrong" below.',
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
    h: 'Delivery and collection',
    p: [
      'You are welcome to collect your puppy in person. Where you choose nationwide delivery, travel is arranged with a pet courier or ground transport and charged separately.',
      'Delivery dates are estimates. We will not send a puppy that is unwell or too young to travel safely, and will reschedule instead.',
    ],
  },
  {
    h: 'Your responsibilities as an owner',
    p: [
      'By buying from us you agree to provide appropriate food, shelter, training and veterinary care for the life of the dog.',
      'If you are ever unable to keep your dog, we ask that you contact us first — we would rather take a dog back than see it rehomed through a shelter.',
    ],
  },
  {
    h: 'If something goes wrong',
    p: [
      'If we are unable to supply the puppy you reserved — for example due to illness or a change in the litter — you may choose another available puppy, wait for the next litter, or receive a full refund of your deposit.',
      'Nothing in these terms limits your rights under applicable consumer law.',
    ],
  },
  {
    h: 'Liability',
    p: ['We share known health, lineage and temperament information in good faith. Dogs are living animals and no breeder can guarantee future health or personality beyond the written guarantee provided.'],
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
