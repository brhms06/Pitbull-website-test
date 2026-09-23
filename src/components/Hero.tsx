'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PawIcon, ArrowRightIcon, HeartIcon } from './Icons';
import { site } from '@/data/site';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-ember-200/40 blur-3xl sm:h-96 sm:w-96" aria-hidden />
      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-forest-500/10 blur-3xl sm:h-96 sm:w-96" aria-hidden />
      <div className="absolute inset-0 bg-paw-pattern opacity-70" aria-hidden />

      <div className="container-page relative py-20 md:py-28 lg:py-32">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span
            className="badge inline-flex animate-fade-up items-center gap-1.5 bg-ember-100 text-ember-700"
            style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}
          >
            <PawIcon className="h-4 w-4" /> {site.tagline}
          </span>

          <h1
            className="mt-4 animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}
          >
            Health-tested Doberman puppies <span className="text-forest">raised with love</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-muted"
            style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
          >
            We raise confident, well-socialised Doberman puppies — vet-checked, vaccinated and
            ready to join your family. Reserve yours today, with nationwide delivery available.
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3"
            style={{ animationDelay: '360ms', animationFillMode: 'backwards' }}
          >
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              <Link href="/contact" className="btn-accent inline-flex items-center gap-2 text-base shadow-glow">
                <HeartIcon className="h-5 w-5" filled /> Bring Me Home
              </Link>
            </motion.div>
            <Link href="/dogs" className="btn-primary inline-flex items-center gap-2 text-base">
              View Available Puppies <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <dl
            className="mx-auto mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4"
            style={{ animationDelay: '480ms', animationFillMode: 'backwards' }}
          >
            {[
              { n: site.soldCount, l: 'Puppies placed' },
              { n: String(new Date().getFullYear() - site.foundedYear), l: 'Years breeding' },
              { n: '100%', l: 'Health guaranteed' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-2xl font-extrabold text-forest">{s.n}</dt>
                <dd className="text-sm text-muted">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
