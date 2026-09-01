'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { PawIcon, HomeIcon, ShoppingBagIcon, ClipboardIcon, ArrowRightIcon, StarIcon } from '@/components/Icons';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, exact: true },
  { href: '/admin/dogs', label: 'Puppies', icon: <ShoppingBagIcon className="h-5 w-5" />, exact: false },
  { href: '/admin/testimonials', label: 'Testimonials', icon: <StarIcon className="h-5 w-5" />, exact: false },
  { href: '/admin/submissions', label: 'Submissions', icon: <ClipboardIcon className="h-5 w-5" />, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isActive = (href: string, exact: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-forest-800 p-5 text-cream md:flex">
        <div className="flex items-center gap-2 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <PawIcon className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-sm font-extrabold leading-tight text-white">Ironline Bullies</p>
            <p className="text-xs text-cream/70">Admin</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive(item.href, item.exact) ? 'bg-white/15 text-white' : 'text-cream/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-cream/75 transition hover:bg-white/10 hover:text-white">
          <ArrowRightIcon className="h-5 w-5" /> View live site
        </Link>
        <button type="button" onClick={signOut} className="mt-1 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
          Sign out
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-sand bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <PawIcon className="h-6 w-6 text-forest-600" />
            <span className="font-extrabold text-forest-800">Admin</span>
          </div>
          <button type="button" onClick={signOut} className="btn-ghost px-3 py-1.5 text-sm">
            Sign out
          </button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-sand bg-white px-3 py-2 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                isActive(item.href, item.exact) ? 'bg-forest-50 text-forest-700' : 'text-muted'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 overflow-x-hidden p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
