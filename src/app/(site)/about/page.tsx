import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import TrustBadge from '@/components/TrustBadge';
import { ShieldIcon, HeartIcon, PawIcon, ArrowRightIcon, StarIcon, HandshakeIcon } from '@/components/Icons';
import { team } from '@/data/team';
import { site } from '@/data/site';

const heroImg = 'https://placedog.net/1400/700?id=80';

const values = [
  { icon: <HeartIcon className="h-7 w-7" />, title: 'Compassion first', text: 'Every puppy is raised underfoot in our home with patience and affection — from birth to the day they go home.' },
  { icon: <ShieldIcon className="h-7 w-7" />, title: 'Health guaranteed', text: 'Vet checks, vaccinations and honest health records come standard before any puppy is placed.' },
  { icon: <HandshakeIcon className="h-7 w-7" />, title: 'Lifelong support', text: 'We stay in touch long after pickup, with friendly advice whenever you need it.' },
];

export const metadata: Metadata = {
  title: 'About Us — American Bully Breeder',
  description: `Learn about ${site.name}, how we home-raise healthy, socialized American Bully puppies, and our written health guarantee.`,
};

export default function AboutPage() {
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About Us | ${site.name}`,
    description: `Learn about ${site.name}, how we home-raise healthy, socialized American Bully puppies, and our written health guarantee.`,
    url: `${site.url}/about`,
    mainEntity: { '@type': 'PetStore', name: site.name, url: site.url },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: `${site.url}/about` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([aboutPageSchema, breadcrumbJsonLd]) }} />
      <PageHero
        title={`About ${site.name}`}
        subtitle="A small, passionate breeder raising healthy, well-socialised American Bully puppies for families across the US."
        image={heroImg}
        breadcrumb="About Us"
      />

      {/* Story */}
      <section className="container-page py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem] shadow-lift ring-1 ring-black/5">
            <img src="https://placedog.net/900/700?id=81" alt="An American Bully resting comfortably" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Our story" title={`Raising exceptional American Bully puppies since ${site.foundedYear}`} className="!mx-0" />
            <p className="mt-5 leading-relaxed text-ink/85">
              {site.name} began with a simple love for this loyal, muscular breed. Our puppies are raised underfoot
              in our home — not in kennels — so they grow up confident, affectionate and beautifully socialised with
              people and other pets.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              Every puppy is health-checked, vaccinated and comes with a health guarantee. Over the years we&apos;ve
              placed <strong className="text-forest-700">{site.soldCount} puppies</strong> with happy families — and
              counting.
            </p>
            <div className="mt-6 rounded-2xl bg-forest-50 p-5">
              <p className="font-bold text-forest-800">Our promise</p>
              <p className="mt-1 text-sm text-ink/80">
                To raise healthy, happy, well-socialised American Bully puppies and match them with loving families —
                with support for life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-sand/60 py-14">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TrustBadge icon={<ShieldIcon />} title="Health Guarantee" subtitle="Vet-checked & vaccinated" />
          <TrustBadge icon={<HeartIcon />} title={`${site.soldCount} Puppies Placed`} subtitle={`Since ${site.foundedYear}`} />
          <TrustBadge icon={<PawIcon />} title="Nationwide Delivery" subtitle="Safe door-to-door transport" />
          <TrustBadge icon={<StarIcon />} title="5-Star Breeder" subtitle="Trusted by families" />
        </div>
      </section>

      {/* Our values */}
      <section className="container-page py-14 md:py-20">
        <SectionHeading eyebrow="What we stand for" title="Our values" description="The principles that guide how we raise our puppies and care for every family." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card p-7 text-center transition hover:-translate-y-1 hover:shadow-lift">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">{v.icon}</span>
              <h3 className="mt-5 text-lg font-extrabold text-forest-800">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-sand/40 py-14 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Meet the team" title="The family behind the breeder" description="A small team who raise, socialise and care for every puppy before it goes home." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="card overflow-hidden text-center transition hover:-translate-y-1 hover:shadow-lift">
                <div className="aspect-square overflow-hidden">
                  <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-forest-800">{m.name}</h3>
                  <p className="text-sm font-semibold text-ember">{m.role}</p>
                  <p className="mt-2 text-sm text-muted">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why American Bullies */}
      <section className="bg-forest-800 py-14 text-white md:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem] shadow-lift lg:order-2">
            <img src="https://placedog.net/900/700?id=82" alt="A muscular American Bully" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="lg:order-1">
            <span className="badge inline-flex items-center gap-1.5 bg-white/15 text-white">
              <PawIcon className="h-3.5 w-3.5" /> The breed
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-white">Why families love American Bullies</h2>
            <p className="mt-4 leading-relaxed text-cream/85">
              American Bullies are one of the most affectionate, family-oriented breeds — confident, sociable and
              devoted to their people. Their sturdy build and gentle, loyal personalities make them a wonderful
              addition to any home.
            </p>
            <ul className="mt-5 space-y-2 text-cream/85">
              <li>• Loyal, affectionate personalities that crave companionship</li>
              <li>• Great with children when properly socialised</li>
              <li>• Raised in our home and beautifully socialised</li>
            </ul>
            <Link href="/dogs" className="btn-accent mt-7">
              View available puppies <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
