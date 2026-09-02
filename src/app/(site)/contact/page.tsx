import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { MailIcon, PhoneIcon, PinIcon, FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/Icons';
import { site } from '@/data/site';
import { pitbullPhotos } from '@/data/pitbullPhotos';

const heroImg = pitbullPhotos[3];

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${site.name}. Have questions about reserving a puppy, prices, or shipping options? Contact us today.`,
};

export default function ContactPage() {
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
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="text-2xl font-extrabold text-forest-800">Send us a message</h2>
            <p className="mt-2 text-muted">{site.responseTime}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <h3 className="text-lg font-extrabold text-forest-800">Get in touch</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 text-forest-600" />
                  <div>
                    <p className="font-semibold text-forest-800">Phone</p>
                    <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link-quiet">
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 text-forest-600" />
                  <div>
                    <p className="font-semibold text-forest-800">Email</p>
                    <a href={`mailto:${site.email}`} className="link-quiet">
                      {site.email}
                    </a>
                  </div>
                </li>
                {site.address && (
                  <li className="flex items-start gap-3">
                    <PinIcon className="mt-0.5 h-5 w-5 text-forest-600" />
                    <div>
                      <p className="font-semibold text-forest-800">Location</p>
                      <p className="text-muted">{site.address}</p>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-6">
                <p className="text-sm font-semibold text-forest-800">Follow us</p>
                <div className="mt-3 flex gap-3">
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

            <div className="card overflow-hidden">
              <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-forest-50 px-6 text-center">
                <p className="text-base font-bold text-forest-800">Nationwide delivery</p>
                <p className="text-sm text-muted">
                  We are a home-based breeder, so we keep our address private. Local visits are welcome by
                  appointment — message us and we&apos;ll arrange a time.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
