import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PawIcon } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <div className="container-page flex min-h-[64vh] flex-col items-center justify-center gap-5 text-center">
          <PawIcon className="h-20 w-20 text-forest-200" />
          <h1 className="text-5xl font-extrabold text-forest-800">404</h1>
          <p className="max-w-md text-lg text-muted">This page seems to have wandered off. Let&apos;s get you back on track.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/dogs" className="btn-ghost">
              See available puppies
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
