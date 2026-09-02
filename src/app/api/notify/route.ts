import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { site } from '@/data/site';

type NotifyPayload = { type: 'contact' | 'application' | 'order' | 'order-confirmation' | 'newsletter' } & Record<string, unknown>;

function buildEmail(payload: NotifyPayload): { subject: string; text: string } {
  switch (payload.type) {
    case 'contact':
      return {
        subject: `New contact message: ${payload.subject ?? 'General'}`,
        text: `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone || 'Not provided'}\nTopic: ${payload.subject}\n\n${payload.message}`,
      };
    case 'application':
      return {
        subject: `New puppy application for ${payload.dogName || 'a puppy'}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nPuppy: ${payload.dogName}\nLocation: ${payload.address}\nHome type: ${payload.homeType}\nChildren: ${payload.hasChildren}\nOther pets: ${payload.hasPets}\nExperience: ${payload.experience || 'Not provided'}`,
      };
    case 'order':
      return {
        subject: `New puppy order ${payload.orderRef ?? ''} — ${payload.total ?? ''} from ${payload.name ?? ''}`,
        text: `Order ref: ${payload.orderRef}\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nDelivery: ${payload.address || 'Not provided'}\n\nItems:\n${payload.items}\n\nTotal: ${payload.total}\nChosen payment method: ${payload.chosenPaymentMethod || 'Not selected'}\nNotes: ${payload.notes || 'None'}\n\nAll configured payment methods:\n${payload.paymentDetails}\n\nMessage the customer on WhatsApp: ${payload.customerWhatsAppLink || 'Not opted in'}`,
      };
    case 'order-confirmation':
      return {
        subject: `Your Ironline Bullies order ${payload.orderRef ?? ''} — payment details`,
        text: `Hi ${payload.name},\n\nThanks for your order (ref ${payload.orderRef}). Total due: ${payload.total}.\n\nPlease pay via ${payload.paymentMethodLabel}:\n${payload.paymentMethodValue}\n\n${payload.paymentInstructions}\n\n— Ironline Bullies`,
      };
    case 'newsletter':
      return {
        subject: 'New newsletter subscriber',
        text: `Email: ${payload.email}`,
      };
    default:
      return { subject: 'New website submission', text: JSON.stringify(payload, null, 2) };
  }
}

/**
 * POST /api/notify — sends the admin notification email via Resend.
 * The API key stays server-only (never NEXT_PUBLIC_). Always resolves 200,
 * so a missing key or a Resend failure never blocks the caller's form.
 *
 * NOTE: without a verified sending domain in Resend, mail can only be sent
 * from `onboarding@resend.dev` and only *to* the Resend account owner's own
 * email address. Verify a domain in the Resend dashboard once you're ready
 * to deliver to `site.email` — or, for `order-confirmation`, to a real
 * customer address — for real.
 *
 * NOTE: this route is public/unauthenticated. `order-confirmation` sends to
 * whatever `email` the caller supplies, which is fine while Resend's sandbox
 * restriction caps real delivery to one address, but is worth rate-limiting
 * or otherwise hardening before relying on a verified sending domain in a
 * high-traffic production setting.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false });

  try {
    const payload = (await request.json()) as NotifyPayload;
    const { subject, text } = buildEmail(payload);
    const to = payload.type === 'order-confirmation' && typeof payload.email === 'string' && payload.email.trim() ? [payload.email] : [site.email];
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Ironline Bullies <onboarding@resend.dev>',
      to,
      subject,
      text,
    });
    if (error) {
      console.error('[notify] Resend error:', error);
      return NextResponse.json({ ok: false });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[notify] failed:', err);
    return NextResponse.json({ ok: false });
  }
}
