import { createBrowserClient } from '@supabase/ssr';

// Public Supabase project configuration. Vercel env vars can override these values.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mrbgtdrpscdoxwdgvfcs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_7iNsTBn4QsGPZPkX2nOULA_awelYkSl';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
