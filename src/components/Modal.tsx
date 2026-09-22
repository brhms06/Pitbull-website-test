'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'md' | 'lg';
  /** Clicking anywhere on the dialog (not just the backdrop) closes it — callers should stopPropagation() on any interactive element that shouldn't. */
  closeOnContentClick?: boolean;
  /** Replace the full-width bottom "Close" button with a small corner × icon instead. */
  hideCloseButton?: boolean;
}

/** Accessible, animated dialog (scale-up + fade). Closes on Esc / backdrop. */
export default function Modal({ open, onClose, title, children, size = 'md', closeOnContentClick = false, hideCloseButton = false }: Props) {
  // Rendered via a portal straight into <body> so a CSS `transform` on some
  // ancestor (e.g. the homepage puppy grid's overlap effect) can't turn this
  // `fixed` overlay into one scoped to that ancestor's box instead of the viewport.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`card relative z-10 w-full p-7 ${size === 'lg' ? 'max-w-2xl text-left' : 'max-w-md text-center'}`}
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={closeOnContentClick ? onClose : undefined}
          >
            {hideCloseButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest-800 shadow-sm ring-1 ring-black/5 transition hover:scale-110"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {title && <h3 className={`text-2xl font-extrabold text-forest-800 ${hideCloseButton ? 'pr-10' : ''}`}>{title}</h3>}
            <div className={`mt-3 text-muted ${size === 'lg' ? 'max-h-[75vh] overflow-y-auto pr-1' : ''}`}>{children}</div>
            {!hideCloseButton && (
              <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
                Close
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
