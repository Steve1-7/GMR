import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let _supabaseAdmin: any = null;
if (supabaseUrl && supabaseServiceRoleKey) {
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey as string, {
    auth: {
      // service role should never be used in browser — this is for server-side only
    }
  });
} else {
  // Warning only; avoid throwing at import time so builds without env vars can succeed.
  // Routes that require admin client should check for existence and handle appropriately.
  // eslint-disable-next-line no-console
  console.warn('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL not set; supabaseAdmin is unavailable.');
}

export const supabaseAdmin = _supabaseAdmin;

export default supabaseAdmin;
