// Best-effort, in-memory sliding-window rate limiter.
//
// Cloudflare Workers run many isolates and each has its own memory, so this
// is NOT a global limit — it blunts casual brute-force and spam from a single
// client hitting one isolate. For a hard limit, also add a Cloudflare WAF
// rate-limiting rule on /api/admin/login and /api/join.

const buckets = new Map<string, number[]>();

export function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

/** Returns true if the call is allowed, false if the limit is exceeded. */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter(t => now - t < windowMs);

  if (recent.length >= max) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);

  // Opportunistic cleanup so the map can't grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.some(t => now - t < windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export function tooManyRequests(message = 'Too many requests. Please try again later.') {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '900' },
  });
}
