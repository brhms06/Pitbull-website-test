import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. The values below fall back to this project's own
 * public credentials when env vars aren't set — the anon key is *designed* to
 * be exposed in the browser bundle because every table is protected by Row
 * Level Security (see supabase/schema.sql). Never put the `service_role` key
 * in this file.
 *
 * TODO: replace the fallback URL/key with your own Supabase project's values,
 * or set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY in `.env.local`.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://YOUR-PROJECT-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'your-anon-key';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/** Storage bucket that holds uploaded dog photos/videos. */
export const DOG_IMAGES_BUCKET = 'dog-images';

/** Shared singleton for client components that don't need a fresh instance. */
export const supabase = createClient();
