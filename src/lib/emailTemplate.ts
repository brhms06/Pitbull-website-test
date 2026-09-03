type Row = { label: string; value: string };

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renders the HTML body for an admin-notification email: centered card,
 * brand-gradient badge mark, heading, intro line, label/value detail rows,
 * and a soft footer note. Every interpolated value is HTML-escaped since
 * `rows`, `heading` and `intro` carry raw input from public, unauthenticated
 * site forms.
 */
export function renderAdminEmail(params: { emoji: string; heading: string; intro: string; rows: Row[]; footerName?: string }): string {
  const { emoji, heading, intro, rows, footerName } = params;

  const rowsHtml = rows
    .map(
      (r) => `
        <tr>
          <td style="padding:10px 0;border-top:1px solid #ece7dd;font:600 13px/1.4 ui-sans-serif,system-ui,sans-serif;color:#211f1c;vertical-align:top;width:130px;">${escapeHtml(r.label)}</td>
          <td style="padding:10px 0;border-top:1px solid #ece7dd;font:400 13px/1.5 ui-sans-serif,system-ui,sans-serif;color:#69625a;white-space:pre-line;">${escapeHtml(r.value)}</td>
        </tr>`,
    )
    .join('');

  const footerText = footerName
    ? `Automated notification from the Ironline Bullies website. Reply to this email to respond directly to ${escapeHtml(footerName)}.`
    : 'Automated notification from the Ironline Bullies website.';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f2;font-family:ui-sans-serif,system-ui,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:20px;border:1px solid #ece7dd;box-shadow:0 10px 30px -12px rgba(33,31,28,0.12);">
            <tr>
              <td style="padding:40px 36px 8px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
                  <tr>
                    <td width="56" height="56" style="width:56px;height:56px;border-radius:16px;background-color:#213e53;background-image:linear-gradient(180deg,#4d7c99,#213e53);text-align:center;vertical-align:middle;font-size:26px;line-height:56px;">${emoji}</td>
                  </tr>
                </table>
                <h1 style="margin:0 0 10px;font-size:21px;line-height:1.3;color:#213e53;font-weight:800;">${escapeHtml(heading)}</h1>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#69625a;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 36px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 36px 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;border-radius:12px;">
                  <tr>
                    <td style="padding:16px 18px;font-size:12px;line-height:1.6;color:#69625a;text-align:center;">${footerText}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
