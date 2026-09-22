import Link from 'next/link';
import Hero from '@/components/Hero';
import { localBusinessSchema, site } from '@/data/site';
import DogSlideshow from '@/components/DogSlideshow';
import SectionHeading from '@/components/SectionHeading';
import AvailablePuppiesPreview from '@/components/AvailablePuppiesPreview';
import Reveal from '@/components/Reveal';
import {
  ArrowRightIcon,
  HeartIcon,
  PawIcon,
  ShieldIcon,
  HomeIcon,
  SearchIcon,
  ClipboardIcon,
  CheckIcon,
  StarIcon,
} from '@/components/Icons';
import { fetchPublicDogsServer, fetchPublicTestimonialsServer } from '@/lib/db.server';
import { dobermanPhotos } from '@/data/dobermanPhotos';

const services = [
  { icon: <HeartIcon className="h-7 w-7" />, title: 'Health-Tested', text: 'Every puppy is vet-checked, vaccinated and comes with a written health guarantee.' },
  { icon: <PawIcon className="h-7 w-7" />, title: 'Home-Raised', text: 'Our puppies are raised underfoot in our home and beautifully socialised from birth.' },
  { icon: <HomeIcon className="h-7 w-7" />, title: 'Perfect Match', text: 'We help you choose the puppy whose personality fits your family best.' },
  { icon: <ShieldIcon className="h-7 w-7" />, title: 'Lifelong Support', text: 'We are here for advice and guidance long after your puppy goes home.' },
];

const reservationSteps = [
  { step: '01', icon: <SearchIcon className="h-6 w-6" />, title: 'Browse our puppies', text: 'Explore our available Doberman puppies and find the one whose look and personality you love.' },
  { step: '02', icon: <ClipboardIcon className="h-6 w-6" />, title: 'Reserve with a deposit', text: 'Place a deposit to hold your puppy. We keep you updated with photos and videos as they grow.' },
  { step: '03', icon: <ShieldIcon className="h-6 w-6" />, title: 'Health check & vaccines', text: 'Your puppy is vet-checked, vaccinated and ready to go home once old enough to travel.' },
  { step: '04', icon: <HeartIcon className="h-6 w-6" />, title: 'Pickup or delivery', text: 'Collect your puppy in person, or we arrange safe nationwide delivery to your door.' },
];

export default async function HomePage() {
  const [dogs, testimonials] = await Promise.all([fetchPublicDogsServer(), fetchPublicTestimonialsServer()]);
  const available = dogs.filter((d) => d.status !== 'Sold');
  const availablePuppies = [
    ...available.filter((d) => d.gender === 'Male').slice(0, 3),
    ...available.filter((d) => d.gender === 'Female').slice(0, 3),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Hero />

      {/* Available puppies — background offsets down from the section top so the
          card row straddles the cream-to-sand boundary line. */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-[19rem] bg-sand sm:top-48 md:top-56" aria-hidden />
        <div className="container-page relative py-16 md:py-24">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeading align="left" eyebrow="Available now" title="Our current puppies" className="!mx-0" />
            <Link href="/dogs" className="btn-ghost shrink-0">
              View all puppies <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-20 -translate-y-12 sm:-translate-y-16">
            <AvailablePuppiesPreview dogs={availablePuppies} />
          </div>
        </div>
      </section>

      {/* Tagline band */}
      <section className="bg-forest text-white">
        <div className="container-page flex flex-col items-center gap-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Loyal Companions, Built Strong</h2>
            <p className="mt-2 max-w-2xl text-cream/80">
              Dobermans are loyal, intelligent and devoted — and we raise ours with love from day one, so
              they settle into your family with ease.
            </p>
          </div>
          <Link href="/dogs" className="btn-accent shrink-0 text-base">
            View available puppies <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <DogSlideshow />

      {/* Why we exist — service cards */}
      <section className="container-page py-16 md:py-24">
        <SectionHeading
          eyebrow="Why families choose us"
          title="Healthy, happy puppies raised the right way"
          description="From birth to the day they go home, we give every puppy the care, socialisation and health checks they deserve."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card p-7 text-center transition hover:-translate-y-1 hover:shadow-lift">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">{s.icon}</span>
              <h3 className="mt-5 text-lg font-extrabold text-forest-800">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="overflow-hidden bg-sand/40 py-16 md:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative hidden h-[460px] lg:block">
            <img
              src={dobermanPhotos[6]}
              alt="A Doberman being cared for at home"
              loading="lazy"
              className="absolute right-0 top-0 h-4/5 w-3/4 rounded-[2rem] object-cover shadow-lift"
            />
            <img
              src={dobermanPhotos[7]}
              alt="A happy Doberman puppy in a loving home"
              loading="lazy"
              className="absolute bottom-0 left-0 h-2/5 w-2/5 rounded-[1.5rem] object-cover shadow-lift ring-4 ring-cream"
            />
            <div className="absolute bottom-20 right-4 rounded-2xl bg-forest px-5 py-4 text-white shadow-lift">
              <p className="text-2xl font-extrabold leading-none">{site.soldCount}</p>
              <p className="mt-1 text-xs text-cream/80">puppies placed since {site.foundedYear}</p>
            </div>
          </div>

          <Reveal>
            <SectionHeading align="left" eyebrow="About us" title="A breeder built on love for the Doberman" className="!mx-0" />
            <p className="mt-5 leading-relaxed text-ink/85">
              Founded in {site.foundedYear} by a family of Doberman lovers, we raise our puppies underfoot in
              our home — never in kennels — so they grow up confident, affectionate and ready to bond with you.
            </p>
            <p className="mt-4 leading-relaxed text-ink/85">
              Every puppy is fully health-checked, vaccinated and micro-chipped before going home, and comes with a
              health guarantee. We stay in touch long after pickup — because our families are part of ours.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-forest-100 pt-6">
              {[
                { n: site.soldCount, l: 'Puppies placed' },
                { n: String(new Date().getFullYear() - site.foundedYear), l: 'Years breeding' },
                { n: '100%', l: 'Health guaranteed' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-extrabold text-forest">{s.n}</p>
                  <p className="mt-0.5 text-sm text-muted">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/about" className="btn-primary">
                Our story <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link href="/dogs" className="btn-ghost">
                View puppies
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How reservation works */}
      <section className="bg-forest-800 py-16 text-white md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Simple process"
            title={<span className="text-white">How to reserve your puppy</span>}
            description={<span className="text-cream/80">Reserving a puppy with us is straightforward, transparent and supported every step of the way.</span>}
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reservationSteps.map((step, i) => (
              <div key={step.step} className="relative flex flex-col">
                {i < reservationSteps.length - 1 && <div className="absolute left-full top-7 hidden h-px w-8 bg-white/20 lg:block" />}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-ember">{step.icon}</div>
                <span className="mt-4 text-sm font-bold text-ember">{step.step}</span>
                <h3 className="mt-2 text-lg font-extrabold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/dogs" className="btn-accent text-base">
              Browse available puppies <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-16 md:py-24">
          <SectionHeading eyebrow="Happy families" title="What our families say" description="Families across the country trust us for healthy, well-socialised Doberman puppies." />
          <Reveal stagger={0.1} className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 6).map((t) => (
              <div key={t.id} className="card flex flex-col gap-3 p-6">
                <p className="font-bold text-forest-800">{t.customerName}</p>
                <div className="flex gap-0.5 text-ember">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {/* Health guarantee + delivery */}
      <section className="bg-sand/40 py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Why buy from us" title="More than just a puppy" description="Every family gets a healthy, well-socialised companion — plus our guidance and support for life." />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl bg-forest p-8 text-white">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <ShieldIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Health guarantee</h3>
              <p className="mt-3 leading-relaxed text-cream/80">
                Every puppy leaves us healthy and protected. You receive full records and a written health guarantee
                for total peace of mind.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-cream/80">
                {['Vet-checked & vaccinated', 'Dewormed', 'Microchipped', 'Written health guarantee'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-ember-200" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dogs" className="btn-accent mt-7 inline-flex">
                View puppies <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-ember-600 p-8 text-white">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <HomeIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Safe, Reliable Puppy Transportation</h3>
              <p className="mt-3 leading-relaxed text-white/85">
                At {site.name}, we understand that bringing your new Doberman home is an exciting experience. Our
                priority is making sure every puppy travels safely, comfortably, and with the care they deserve.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/85">
                {['Safe nationwide delivery', 'Photo & video updates', 'Support before & after'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-white/70" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ember-700 transition hover:bg-cream">
                Ask about delivery <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-forest-800 py-16 text-center text-white md:py-20">
        <div className="absolute inset-0 bg-paw-pattern opacity-20" aria-hidden />
        <div className="container-page relative">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">Ready to welcome a Doberman puppy?</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Reserve your puppy today and we&apos;ll guide you through every step — from deposit to delivery. Your new
            best friend is waiting.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dogs" className="btn-accent inline-flex items-center gap-2 text-base shadow-glow">
              <HeartIcon className="h-5 w-5" filled /> View available puppies
            </Link>
            <Link href="/contact" className="btn-outline-white text-base">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
