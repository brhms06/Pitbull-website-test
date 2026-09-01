'use client';

import { useState } from 'react';
import Modal from './Modal';
import { ShareIcon } from './Icons';

export default function ShareButton({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Meet ${name}`, url });
        return;
      } catch {
        /* user cancelled — fall through to modal */
      }
    }
    setOpen(true);
  };

  return (
    <>
      <button type="button" onClick={share} className="btn-ghost text-sm">
        <ShareIcon className="h-5 w-5" /> Share
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Share ${name}`}>
        Copy the link from your browser&apos;s address bar to share {name}&apos;s profile.
      </Modal>
    </>
  );
}
