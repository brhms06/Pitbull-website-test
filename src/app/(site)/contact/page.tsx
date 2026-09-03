import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { MailIcon, PhoneIcon, PinIcon, FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/Icons';
import { site } from '@/data/site';
import { pitbullPhotos } from '@/data/pitbullPhotos';
import { fetchPublicDogsServer } from '@/lib/db.server';

const heroImg = pitbullPhotos[3];

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${site.name}. Have questions about reserving a puppy, prices, or shipping options? Contact us today.`,
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ dog?: string }> }) {
  const { dog } = await searchParams;
  const dogs = await fetchPublicDogsServer();
  const available = dogs.filter((d) => d.status !== 'Sold').map((d) => ({ id: d.id, name: d.name }));
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact Us | ${site.name}`,
    url: `${site.url}/contact`,
    mainEntity: { '@type': 'PetStore', name: site.name, url: site.url, telephone: site.phone, email: site.email },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: `${site.url}/contact` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([contactPageSchema, breadcrumbJsonLd]) }} />
      <PageHero title="Contact Us" subtitle="Questions about reservations, pricing or delivery? We'd love to hear from you." image={heroImg} />

      <section className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <ContactForm dogs={available} initialDogId={dog} />

          <div className="card mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 p-6 text-sm">
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link-quiet flex items-center gap-2 font-semibold text-forest-800">
              <PhoneIcon className="h-5 w-5 text-forest-600" /> {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="link-quiet flex items-center gap-2 font-semibold text-forest-800">
              <MailIcon className="h-5 w-5 text-forest-600" /> {site.email}
            </a>
            {site.address && (
              <span className="flex items-center gap-2 font-semibold text-forest-800">
                <PinIcon className="h-5 w-5 text-forest-600" /> {site.address}
              </span>
            )}
            <div className="flex gap-3">
              {[
                { href: site.social.facebook, label: 'Facebook', icon: <FacebookIcon /> },
                { href: site.social.instagram, label: 'Instagram', icon: <InstagramIcon /> },
                { href: site.social.tiktok, label: 'TikTok', icon: <TikTokIcon /> },
              ]
                .filter((s) => s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-50 text-forest-700 transition hover:-translate-y-0.5 hover:bg-ember hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
