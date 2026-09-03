import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { site } from '@/data/site';
import { renderAdminEmail } from '@/lib/emailTemplate';

type NotifyPayload = { type: 'contact' | 'application' | 'contract' | 'newsletter' } & Record<string, unknown>;

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' && v.trim() ? v : fallback;
}

function buildEmail(payload: NotifyPayload): { subject: string; text: string; html?: string } {
  switch (payload.type) {
    case 'contact':
      return {
        subject: `New contact message: ${payload.subject ?? 'General'}`,
        text: `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone || 'Not provided'}\nTopic: ${payload.subject}\nPuppy: ${payload.dogName || 'Not specified'}\nAddress: ${payload.address || 'Not provided'}\n\n${payload.message}`,
        html: renderAdminEmail({
          emoji: '📬',
          heading: 'New contact message',
          intro: `${str(payload.name, 'A visitor')} sent a message through the contact form.`,
          rows: [
            { label: 'Name', value: str(payload.name) },
            { label: 'Email', value: str(payload.email) },
            { label: 'Phone', value: str(payload.phone, 'Not provided') },
            { label: 'Topic', value: str(payload.subject, 'General') },
            { label: 'Puppy', value: str(payload.dogName, 'Not specified') },
            { label: 'Address', value: str(payload.address, 'Not provided') },
            { label: 'Message', value: str(payload.message) },
          ],
          footerName: str(payload.name) || undefined,
        }),
      };
    case 'application':
      return {
        subject: `New puppy application for ${payload.dogName || 'a puppy'}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nPuppy: ${payload.dogName}\nLocation: ${payload.address}\nHome type: ${payload.homeType}\nChildren: ${payload.hasChildren}\nOther pets: ${payload.hasPets}\nExperience: ${payload.experience || 'Not provided'}`,
        html: renderAdminEmail({
          emoji: '🐾',
          heading: 'New puppy application',
          intro: `${str(payload.name, 'Someone')} applied for ${str(payload.dogName, 'a puppy')}.`,
          rows: [
            { label: 'Name', value: str(payload.name) },
            { label: 'Email', value: str(payload.email) },
            { label: 'Phone', value: str(payload.phone) },
            { label: 'Puppy', value: str(payload.dogName) },
            { label: 'Location', value: str(payload.address) },
            { label: 'Home type', value: str(payload.homeType) },
            { label: 'Children', value: str(payload.hasChildren) },
            { label: 'Other pets', value: str(payload.hasPets) },
            { label: 'Experience', value: str(payload.experience, 'Not provided') },
          ],
          footerName: str(payload.name) || undefined,
        }),
      };
    case 'contract':
      return {
        subject: `Signed puppy contract: ${payload.buyerName ?? ''} — ${payload.dogName || 'a puppy'}`,
        text: `Buyer: ${payload.buyerName}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nPuppy: ${payload.dogName || 'Not specified'}\nAddress: ${payload.address || 'Not provided'}\nShipping: ${payload.shippingOption || 'Not specified'}\nPayment method: ${payload.paymentMethod || 'Not specified'}\nAgreed price: ${payload.price || 'Not specified'}\n\nSigned by the buyer — signature attached.`,
        html: renderAdminEmail({
          emoji: '✍️',
          heading: 'Signed puppy contract',
          intro: `${str(payload.buyerName, 'The buyer')} signed the puppy contract for ${str(payload.dogName, 'a puppy')}.`,
          rows: [
            { label: 'Buyer', value: str(payload.buyerName) },
            { label: 'Email', value: str(payload.email) },
            { label: 'Phone', value: str(payload.phone) },
            { label: 'Puppy', value: str(payload.dogName, 'Not specified') },
            { label: 'Address', value: str(payload.address, 'Not provided') },
            { label: 'Shipping', value: str(payload.shippingOption, 'Not specified') },
            { label: 'Payment method', value: str(payload.paymentMethod, 'Not specified') },
            { label: 'Agreed price', value: str(payload.price, 'Not specified') },
            { label: 'Signature', value: 'Attached as signature.png' },
          ],
          footerName: str(payload.buyerName) || undefined,
        }),
      };
    case 'newsletter':
      return {
        subject: 'New newsletter subscriber',
        text: `Email: ${payload.email}`,
        html: renderAdminEmail({
          emoji: '📰',
          heading: 'New newsletter subscriber',
          intro: 'Someone subscribed to updates from the website.',
          rows: [{ label: 'Email', value: str(payload.email) }],
        }),
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
 * to deliver to `site.email` for real.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false });

  try {
    const payload = (await request.json()) as NotifyPayload;
    const { subject, text, html } = buildEmail(payload);
    const to = [site.email];

    // Admin-bound notifications reply straight back to the customer who
    // triggered them, so hitting Reply in the inbox reaches the customer
    // instead of the onboarding@resend.dev sender address.
    const replyTo = typeof payload.email === 'string' && payload.email.trim() ? payload.email : undefined;

    // The signature pad hands us a `data:image/png;base64,...` URL — Resend
    // attachments want just the base64 payload.
    const signature = typeof payload.signature === 'string' ? payload.signature : '';
    const attachments =
      payload.type === 'contract' && signature.startsWith('data:image/png;base64,')
        ? [{ filename: 'signature.png', content: signature.split(',')[1] }]
        : undefined;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Ironline Bullies <onboarding@resend.dev>',
      to,
      replyTo,
      subject,
      text,
      html,
      attachments,
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
