'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PawIcon, ArrowRightIcon, HeartIcon } from './Icons';
import { site } from '@/data/site';
import { pitbullPhotos } from '@/data/pitbullPhotos';

const heroImages = [
  { src: pitbullPhotos[0], alt: 'A Pitbull puppy resting peacefully' },
  { src: pitbullPhotos[1], alt: 'A muscular Pitbull gazing into the distance' },
  { src: pitbullPhotos[2], alt: 'A gentle Pitbull puppy curled up in a cosy home' },
];

const SLIDE_INTERVAL = 3000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroImages.length), SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-paw-pattern opacity-70" aria-hidden />
      <div className="container-page relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <div>
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
            Health-tested Pitbull puppies <span className="text-forest">raised with love</span>
          </h1>

          <p
            className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-muted"
            style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}
          >
            We raise confident, well-socialised Pitbull puppies — vet-checked, vaccinated and
            ready to join your family. Reserve yours today, with nationwide delivery available.
          </p>

          <div
            className="mt-8 flex animate-fade-up flex-wrap gap-3"
            style={{ animationDelay: '360ms', animationFillMode: 'backwards' }}
          >
            <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
              <Link href="/contact" className="btn-accent inline-flex items-center gap-2 text-base shadow-glow">
                <HeartIcon className="h-5 w-5" filled /> Bring Me Home
              </Link>
            </motion.div>
            <Link href="/dogs" className="btn-primary hidden items-center gap-2 text-base lg:inline-flex">
              View Available Puppies <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>

          <dl
            className="mt-10 grid max-w-md animate-fade-up grid-cols-3 gap-4"
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

        {/* Image slideshow */}
        <div className="relative animate-fade-up" style={{ animationDelay: '120ms', animationFillMode: 'backwards' }}>
          <div className="relative">
            <div className="relative h-[460px] overflow-hidden rounded-[2.5rem] shadow-lift ring-1 ring-black/5">
              <AnimatePresence>
                <motion.img
                  key={index}
                  src={heroImages[index].src}
                  alt={heroImages[index].alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1.04 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{
                    opacity: { duration: 0.7, ease: 'easeInOut' },
                    scale: { duration: SLIDE_INTERVAL / 1000 + 0.7, ease: 'easeOut' },
                  }}
                  fetchPriority="high"
                />
              </AnimatePresence>

              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {heroImages.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show dog photo ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? 'w-7 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="absolute -bottom-5 -left-5 z-10 hidden rounded-2xl bg-white p-4 shadow-lift ring-1 ring-black/5 sm:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="flex items-center gap-1.5 text-sm font-bold text-forest-800">
                <PawIcon className="h-4 w-4 text-forest-600" /> Home-raised with love
              </p>
              <p className="text-xs text-muted">Vet-checked &amp; vaccinated</p>
            </motion.div>
          </div>

          <Link href="/dogs" className="btn-primary mt-10 inline-flex text-base sm:mt-8 lg:hidden">
            View Available Puppies <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
