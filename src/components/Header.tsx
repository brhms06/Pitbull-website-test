'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { HeartIcon, LockIcon } from './Icons';
import { primaryNavLinks, moreNavLinks, site } from '@/data/site';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Only render portal after client-side hydration to avoid SSR mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Shrink + shadow on scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setDesktopMoreOpen(false);
    setMobileMoreOpen(false);
  }, [pathname]);

  // Close the desktop "More" dropdown on outside click or Escape.
  useEffect(() => {
    if (!desktopMoreOpen) return;
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setDesktopMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDesktopMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [desktopMoreOpen]);

  // Lock body scroll while menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Focus the close button when the menu opens for accessibility.
  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [menuOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const isMoreActive = moreNavLinks.some((l) => isActive(l.href));

  const navItemClass = (href: string) =>
    [
      'relative rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200',
      'hover:scale-[1.03] hover:text-ember',
      isActive(href) ? 'text-ember' : 'text-forest-800',
    ].join(' ');

  return (
    <>
      <header
        className={[
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'bg-cream shadow-soft md:bg-cream/90 md:backdrop-blur md:supports-[backdrop-filter]:bg-cream/75'
            : 'bg-cream md:bg-cream/80 md:backdrop-blur',
        ].join(' ')}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {primaryNavLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navItemClass(link.href)}>
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ember"
                  />
                )}
              </Link>
            ))}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setDesktopMoreOpen((v) => !v)}
                aria-expanded={desktopMoreOpen}
                aria-haspopup="menu"
                className={[
                  'relative rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200',
                  'hover:scale-[1.03] hover:text-ember',
                  isMoreActive ? 'text-ember' : 'text-forest-800',
                ].join(' ')}
              >
                More <span className="ml-0.5 inline-block text-xs align-middle">{desktopMoreOpen ? '▲' : '▼'}</span>
                {isMoreActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-ember"
                  />
                )}
              </button>

              {desktopMoreOpen && (
                <div role="menu" className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-black/5">
                  {moreNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-forest-50 hover:text-ember ${
                        isActive(link.href) ? 'text-ember' : 'text-forest-700'
                      }`}
                    >
                      {link.href === '/privacy' && <LockIcon className="h-3.5 w-3.5" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <motion.div
              className="hidden sm:block"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Link
                href="/dogs"
                className="btn-accent inline-flex items-center gap-2 shadow-glow"
                aria-label="Bring me home"
              >
                <HeartIcon className="h-4 w-4" filled /> Bring Me Home
              </Link>
            </motion.div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-forest-800 transition hover:bg-forest-50 xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <Burger open={menuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/*
        The mobile drawer deliberately avoids framer-motion and Tailwind for every
        property that affects legibility (background, text colour, borders, z-index).
        Those are inline styles so that no purge step, no missing animation chunk and
        no half-finished transition can ever leave the panel see-through.
      */}
      {mounted &&
        createPortal(
          <div
            aria-hidden={!menuOpen}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9990,
              visibility: menuOpen ? 'visible' : 'hidden',
              pointerEvents: menuOpen ? 'auto' : 'none',
            }}
          >
            <div
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(33,31,28,0.6)',
                opacity: menuOpen ? 1 : 0,
                transition: 'opacity 220ms ease',
              }}
            />

            <div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                width: '84%',
                maxWidth: '360px',
                backgroundColor: '#f4efe6',
                boxShadow: '-8px 0 40px rgba(33,31,28,0.28)',
                borderLeft: '1px solid #e6dcc9',
                transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #e6dcc9', backgroundColor: '#f4efe6' }}
              >
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Logo />
                </Link>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-forest-100"
                  style={{ color: '#1c3345' }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 px-4 py-5" aria-label="Mobile" style={{ backgroundColor: '#f4efe6' }}>
                {primaryNavLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      tabIndex={menuOpen ? 0 : -1}
                      className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold"
                      style={{ color: active ? '#b5502e' : '#1c3345', backgroundColor: active ? '#e8eef2' : 'transparent' }}
                    >
                      <span className="flex items-center gap-2">{link.label}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setMobileMoreOpen((v) => !v)}
                  aria-expanded={mobileMoreOpen}
                  tabIndex={menuOpen ? 0 : -1}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold"
                  style={{ color: isMoreActive ? '#b5502e' : '#1c3345', backgroundColor: isMoreActive ? '#e8eef2' : 'transparent' }}
                >
                  <span>More</span>
                  <span style={{ transform: mobileMoreOpen ? 'rotate(90deg)' : 'none', transition: 'transform 200ms ease' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {mobileMoreOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '12px' }}>
                    {moreNavLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          tabIndex={menuOpen && mobileMoreOpen ? 0 : -1}
                          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                          style={{ color: active ? '#b5502e' : '#69625a', backgroundColor: active ? '#e8eef2' : 'transparent' }}
                        >
                          {link.href === '/privacy' && <LockIcon className="h-4 w-4" />}
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </nav>

              <div className="px-5 py-5" style={{ borderTop: '1px solid #e6dcc9', backgroundColor: '#f4efe6' }}>
                <Link
                  href="/dogs"
                  onClick={() => setMenuOpen(false)}
                  tabIndex={menuOpen ? 0 : -1}
                  className="btn-accent flex w-full items-center justify-center gap-2 py-4 text-base font-bold shadow-glow"
                >
                  <HeartIcon className="h-5 w-5" filled /> Bring Me Home
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-6" aria-hidden="true">
      <span
        className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
          open ? 'top-2 rotate-45' : 'top-0'
        }`}
      />
      <span
        className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
          open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
        }`}
      />
      <span
        className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
          open ? 'top-2 -rotate-45' : 'top-4'
        }`}
      />
    </div>
  );
}
