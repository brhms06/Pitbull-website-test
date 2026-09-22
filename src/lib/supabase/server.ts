import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://msgcdajmlelowisaqgpj.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zZ2NkYWptbGVsb3dpc2FxZ3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzYzMDUsImV4cCI6MjEwMzg1MjMwNX0.QyOQdoiQzIBqbvGhZLBxbN1ASwJ1SXmABoecPPAKung';

/**
 * Server Component / Route Handler Supabase client. Reads the auth cookie via
 * `next/headers` — never import this from a `'use client'` file, it will
 * throw at build time.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component during render — middleware already
          // refreshes the session cookie, so this can be safely ignored.
        }
      },
    },
    global: {
      // Next.js caches fetch() in Server Components indefinitely by default,
      // which made pages like the homepage show stale dogs/testimonials after
      // an admin edit. Opt every server-side Supabase request out of that cache.
      fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: 'no-store' }),
    },
  });
}
