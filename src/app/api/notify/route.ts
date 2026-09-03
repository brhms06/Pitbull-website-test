import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { site } from '@/data/site';
import { renderAdminEmail } from '@/lib/emailTemplate';

type NotifyPayload = { type: 'contact' | 'application' | 'contract' | 'order' | 'order-confirmation' | 'newsletter' } & Record<string, unknown>;

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
    case 'order':
      return {
        subject: `New puppy order ${payload.orderRef ?? ''} — ${payload.total ?? ''} from ${payload.name ?? ''}`,
        text: `Order ref: ${payload.orderRef}\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nDelivery: ${payload.address || 'Not provided'}\n\nItems:\n${payload.items}\n\nTotal: ${payload.total}\nChosen payment method: ${payload.chosenPaymentMethod || 'Not selected'}\nNotes: ${payload.notes || 'None'}\n\nAll configured payment methods:\n${payload.paymentDetails}\n\nMessage the customer on WhatsApp: ${payload.customerWhatsAppLink || 'Not opted in'}`,
        html: renderAdminEmail({
          emoji: '🛒',
          heading: 'New puppy order',
          intro: `${str(payload.name, 'A customer')} placed order ${str(payload.orderRef)} — ${str(payload.total)}.`,
          rows: [
            { label: 'Order ref', value: str(payload.orderRef) },
            { label: 'Name', value: str(payload.name) },
            { label: 'Email', value: str(payload.email) },
            { label: 'Phone', value: str(payload.phone) },
            { label: 'Delivery', value: str(payload.address, 'Not provided') },
            { label: 'Items', value: str(payload.items) },
            { label: 'Total', value: str(payload.total) },
            { label: 'Chosen payment method', value: str(payload.chosenPaymentMethod, 'Not selected') },
            { label: 'Notes', value: str(payload.notes, 'None') },
            { label: 'All configured payment methods', value: str(payload.paymentDetails) },
            { label: 'WhatsApp', value: str(payload.customerWhatsAppLink, 'Not opted in') },
          ],
          footerName: str(payload.name) || undefined,
        }),
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
    const { subject, text, html } = buildEmail(payload);
    const to = payload.type === 'order-confirmation' && typeof payload.email === 'string' && payload.email.trim() ? [payload.email] : [site.email];

    // Admin-bound notifications reply straight back to the customer who
    // triggered them, so hitting Reply in the inbox reaches the customer
    // instead of the onboarding@resend.dev sender address.
    const replyTo =
      payload.type !== 'order-confirmation' && typeof payload.email === 'string' && payload.email.trim() ? payload.email : undefined;

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
