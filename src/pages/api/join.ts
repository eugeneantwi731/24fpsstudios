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
    program,
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
  if (!['student', 'alumni', 'non-student'].includes(status_type)) {
    return jsonError(400, 'Status must be student, alumni, or non-student');
  }
  if (status_type === 'student' && (typeof program !== 'string' || !program.trim())) {
    return jsonError(400, 'Program is required for students');
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
  if (consent !== true) {
    return jsonError(400, 'Consent is required');
  }

  const runtimeEnv = (locals as any).runtime?.env;
  const supabase = getAdminSupabase(runtimeEnv);

  const { data, error } = await supabase
    .from('join_submissions')
    .insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      status_type,
      program: status_type === 'student' ? program.trim() : null,
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
    return jsonError(500, 'Something went wrong submitting your application. Please try again.');
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

function jsonError(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}