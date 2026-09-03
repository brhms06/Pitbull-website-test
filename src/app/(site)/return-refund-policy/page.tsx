import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Return & Refund Policy', robots: { index: false, follow: false } };

/**
 * Draft pulled from the "If something goes wrong" / deposit sections of
 * /terms, reframed as a standalone refund policy. Not legal advice — have
 * an attorney review before relying on it.
 */
const sections: Array<{ h: string; p: string[] }> = [
  {
    h: 'Deposits',
    p: [
      'Deposits secure a specific puppy and are non-refundable if you simply change your mind, except in the circumstances below.',
      'The balance of the price is due before the puppy travels.',
    ],
  },
  {
    h: 'If we cannot supply your puppy',
    p: [
      'If we are unable to supply the puppy you reserved — for example due to illness or a change in the litter — you may choose another available puppy, wait for the next litter, or receive a full refund of your deposit.',
      'Nothing in this policy limits your rights under applicable consumer law.',
    ],
  },
  {
    h: 'Health guarantee claims',
    p: [
      'If a covered issue is identified under your puppy\'s written health guarantee, the remedy set out in that guarantee document applies. Contact us as soon as your vet raises a concern so we can help.',
    ],
  },
  {
    h: 'Contact',
    p: [`Questions about a refund? Email us at ${site.email} or call ${site.phone}.`],
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <>
      <PageHero title="Return & Refund Policy" breadcrumb="Return & Refund" subtitle="When a deposit or payment can be refunded." />
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
