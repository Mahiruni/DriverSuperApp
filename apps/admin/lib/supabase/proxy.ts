import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Public Supabase project configuration. Vercel env vars can override these values.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrbgtdrpscdoxwdgvfcs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_7iNsTBn4QsGPZPkX2nOULA_awelYkSl';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(items) {
          items.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getClaims();
  } catch {
    // Never turn a transient Supabase/auth outage into a site-wide 500.
  }
  return response;
}
