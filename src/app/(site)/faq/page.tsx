import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { site } from '@/data/site';

export const metadata: Metadata = { title: "FAQ's" };

/** Site-wide FAQs. Per-dog FAQs live separately in src/data/dogFaqs.ts. */
const faqs: Array<{ question: string; answer: string }> = [
  {
    question: 'How do I reserve a puppy?',
    answer:
      'Reach out through our contact form or WhatsApp with the puppy you\'re interested in. Once we confirm availability, a deposit secures your puppy — the deposit is deducted from the final balance.',
  },
  {
    question: 'How do I pay, and how long is a puppy held for me?',
    answer: `We accept Zelle, Cash App, Chime and Apple Pay. ${site.payment.instructions}`,
  },
  {
    question: 'What does the health guarantee cover?',
    answer:
      'Every puppy leaves us vet-checked, vaccinated appropriately for its age, dewormed and microchipped, with full records supplied, plus a written health guarantee against congenital defects. We recommend having your own vet examine your puppy within 72 hours of arrival.',
  },
  {
    question: 'Do you deliver, and what are my options?',
    answer:
      'Yes — we offer ground transport nationwide, a flight nanny who escorts your puppy on a commercial flight, and local or airport pickup. See our Puppy Delivery page for details.',
  },
  {
    question: 'What comes with my puppy?',
    answer:
      'Vet exam records, vaccination and deworming records, microchip registration, and your written health guarantee. We\'re also available for questions long after you bring your puppy home.',
  },
  {
    question: 'Are your puppies registered?',
    answer:
      'Registration varies by puppy — some are UKC registered, noted on that puppy\'s listing. Ask us about the registration status of any puppy you\'re interested in.',
  },
  {
    question: 'At what age can I take my puppy home?',
    answer:
      'Puppies typically go to their new homes once they\'re fully weaned and have had their first round of vaccinations, generally around 8 weeks old.',
  },
  {
    question: 'Can I see more photos or ask about a specific puppy\'s temperament before reserving?',
    answer:
      'Absolutely — message us through the contact form with the puppy\'s name and we\'ll answer any questions and share more photos or video.',
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero title="FAQ's" breadcrumb="FAQ's" subtitle="Answers to common questions about reserving and receiving your puppy." />
      <article className="container-page max-w-3xl py-14 md:py-20">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="card p-6">
              <h3 className="text-base font-extrabold text-forest-700">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
