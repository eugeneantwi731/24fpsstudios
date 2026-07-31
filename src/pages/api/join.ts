import type { APIRoute } from 'astro';
import { getAdminSupabase } from '../../lib/supabase-admin';

export const prerender = false;

// POST /api/join
// Public endpoint — no auth. Anyone visiting /join can submit here.
// Inserts straight into join_submissions with status: 'pending'.
// This is intentionally separate from member_submissions: join
// applicants haven't been vetted yet and their fields don't match
// the member profile shape.
export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const {
    full_name,
    email,
    phone,
    status_type,
    student_program,
    student_year,
    why_join,
    heard_about,
    skills,
    experience,
    portfolio,
    consent,
  } = body;

  // ── Server-side validation (mirrors the client-side checks in
  // join.astro — never trust the browser alone) ──
  if (typeof full_name !== 'string' || !full_name.trim()) {
    return jsonError(400, 'Full name is required');
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError(400, 'A valid email address is required');
  }
  if (typeof phone !== 'string' || !phone.trim()) {
    return jsonError(400, 'Phone / WhatsApp number is required');
  }
  if (!['student', 'alumni', 'non-student'].includes(status_type)) {
    return jsonError(400, 'Status must be student, alumni, or non-student');
  }
  if (status_type === 'student' && (typeof student_program !== 'string' || !student_program.trim())) {
    return jsonError(400, 'Program is required for students');
  }
  if (status_type === 'student' && (typeof student_year !== 'string' || !student_year.trim())) {
    return jsonError(400, 'Year / level is required for students');
  }
  if (typeof why_join !== 'string' || !why_join.trim()) {
    return jsonError(400, 'Please tell us why you want to join');
  }
  if (!['word-of-mouth', 'poster', 'social-media', 'friend-referral', 'other'].includes(heard_about)) {
    return jsonError(400, 'Please tell us how you heard about us');
  }
  if (!Array.isArray(skills) || skills.length === 0) {
    return jsonError(400, 'Please add at least one skill or interest');
  }
  if (!['beginner', 'some-experience', 'experienced'].includes(experience)) {
    return jsonError(400, 'Please select your experience level');
  }
  if (consent !== true) {
    return jsonError(400, 'Consent is required');
  }

  try {
    const runtimeEnv = (locals as any).runtime?.env;
    const supabase = getAdminSupabase(runtimeEnv);

    // TEMP DIAGNOSTIC — safe to leave in briefly, logs no secrets.
    // Confirms which env source is actually supplying the key and
    // roughly what kind of key it is (service_role keys are JWTs
    // that decode to role: "service_role"; anon keys decode to
    // role: "anon"). Remove this block once the bug is fixed.
    try {
      const keyUsed = runtimeEnv?.SUPABASE_SERVICE_ROLE_KEY ?? import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
      const source = runtimeEnv?.SUPABASE_SERVICE_ROLE_KEY ? 'runtimeEnv (Cloudflare)' : 'import.meta.env (.env file)';
      const payload = keyUsed.split('.')[1];
      const decodedRole = payload ? JSON.parse(atob(payload))?.role : 'UNKNOWN — could not decode';
      console.log('[api/join DIAGNOSTIC] key source:', source, '| decoded JWT role:', decodedRole);
    } catch (diagErr) {
      console.log('[api/join DIAGNOSTIC] could not decode key:', diagErr);
    }

    const { data, error } = await supabase
      .from('join_submissions')
      .insert({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        status_type,
        student_program: status_type === 'student' ? student_program.trim() : null,
        student_year: status_type === 'student' ? student_year.trim() : null,
        why_join: why_join.trim(),
        heard_about,
        skills,
        experience: experience || null,
        portfolio: portfolio?.trim() || null,
        consent: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[api/join] insert failed:', error);
      const parts = [error.message, error.details, error.hint, error.code]
        .filter(Boolean)
        .join(' | ');
      return jsonError(500, `Insert failed: ${parts || 'unknown error'}`);
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/join] unexpected error:', err);
    return jsonError(500, `Unexpected error: ${err?.message || String(err)}`);
  }
};

function jsonError(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}