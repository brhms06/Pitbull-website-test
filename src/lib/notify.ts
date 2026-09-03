/**
 * Client-side helper for the fast admin-notification email. Posts to our own
 * `/api/notify` route (which holds the real Resend API key server-side) and
 * never throws — a failed or unconfigured send should never block a form.
 */
export async function notify(payload: { type: 'contact' | 'application' | 'contract' | 'order' | 'order-confirmation' | 'newsletter' } & Record<string, unknown>): Promise<{ ok: boolean }> {
  try {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: Boolean(data?.ok) };
  } catch {
    return { ok: false };
  }
}
