'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { PawIcon, LockIcon } from '@/components/Icons';

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('not confirmed')) {
    return 'Your email is not confirmed yet. Open the confirmation link in your inbox, or confirm the user in Supabase → Authentication → Users.';
  }
  if (m.includes('invalid login')) {
    return 'Wrong email or password — or this account has not been created yet in Supabase.';
  }
  return msg;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (err) {
      setBusy(false);
      setError(friendlyError(err.message));
      return;
    }
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-800 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lift">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
            <PawIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-forest-800">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Ironline Bullies dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <label htmlFor="admin-email" className="label">
              Email
            </label>
            <input id="admin-email" type="email" required autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="admin-password" className="label">
              Password
            </label>
            <input id="admin-password" type="password" required autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-70">
            <LockIcon className="h-4 w-4" /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Need an account? Create one in your Supabase dashboard (Authentication&nbsp;→&nbsp;Users) — any account you create there can sign in here.
        </p>
      </div>
    </div>
  );
}
