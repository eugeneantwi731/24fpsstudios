import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

// POST /api/admin/join/:id/email
// body: { subject: string, body: string }
//
// Sends a real email to the applicant's address, from
// info@24fpsstudios.com, using Gmail's SMTP server. Any logged-in
// admin or editor can send — logs every attempt (sent or failed)
// to join_submission_emails so there's a record on the review page.
//
// Requires two env vars (set in Cloudflare Pages/Workers settings):
//   GMAIL_USER            -> info@24fpsstudios.com
//   GMAIL_APP_PASSWORD    -> 16-character Google App Password
//                            (Google Account -> Security -> App passwords,
//                            requires 2-Step Verification to be on)
//
// Uses `worker-mailer`, an SMTP client built specifically for the
// Cloudflare Workers runtime (regular SMTP libraries like nodemailer
// don't work there — Workers can't open raw TCP sockets the normal
// way; worker-mailer uses the `cloudflare:sockets` API instead).
export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals });
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing submission id');

  let body: { subject?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const subject = body.subject?.trim();
  const messageBody = body.body?.trim();

  if (!subject) return jsonError(400, 'Subject is required');
  if (!messageBody) return jsonError(400, 'Message body is required');

  const { supabase, admin } = auth;

  // Look up the applicant's email — never trust a client-supplied
  // "to" address for this route.
  const { data: submission, error: fetchError } = await supabase
    .from('join_submissions')
    .select('id, email, full_name')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !submission) {
    return jsonError(404, 'Submission not found');
  }

  const runtimeEnv = (locals as any).runtime?.env;
  const GMAIL_USER = runtimeEnv?.GMAIL_USER ?? import.meta.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = runtimeEnv?.GMAIL_APP_PASSWORD ?? import.meta.env.GMAIL_APP_PASSWORD;

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('[join/email] Missing GMAIL_USER / GMAIL_APP_PASSWORD env vars');
    return jsonError(500, 'Email sending is not configured yet');
  }

  let sendError: string | null = null;

  try {
    // Dynamic import keeps this out of the bundle for routes that
    // don't send email, and matches the pattern worker-mailer's own
    // docs recommend for environments where `cloudflare:sockets`
    // isn't available outside the Workers runtime (e.g. local `astro dev`
    // without the Cloudflare adapter's dev server).
    const { WorkerMailer } = await import('worker-mailer');

    const mailer = await WorkerMailer.connect({
      credentials: {
        username: GMAIL_USER,
        password: GMAIL_APP_PASSWORD,
      },
      authType: 'plain',
      host: 'smtp.gmail.com',
      port: 587,      // Gmail's STARTTLS port — connect plain, then upgrade
      secure: false,  // false = don't use implicit TLS on connect
      startTls: true, // upgrade to TLS via STARTTLS once connected (Gmail requires this)
    });

    await mailer.send({
      from: { name: '24fps Decode Animation Lab', email: GMAIL_USER },
      to: { name: submission.full_name, email: submission.email },
      subject,
      text: messageBody,
    });
  } catch (err: any) {
    console.error('[join/email] send failed:', err);
    sendError = err?.message || 'Unknown send error';
  }

  // Log the attempt either way so the review page has a full history.
  const { error: logError } = await supabase.from('join_submission_emails').insert({
    submission_id: id,
    sent_by: admin.username,
    to_email: submission.email,
    subject,
    body: messageBody,
    status: sendError ? 'failed' : 'sent',
    error_message: sendError,
  });

  if (logError) {
    console.error('[join/email] failed to log email:', logError);
  }

  if (sendError) {
    return jsonError(502, `Failed to send email: ${sendError}`);
  }

  return jsonOk({ success: true });
};
