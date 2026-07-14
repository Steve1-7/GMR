import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const createFallbackSupabaseClient = () => {
  const makeQueryResult = (data: any = []) => Promise.resolve({ data, error: null });

  return {
    from: () => ({
      select: () => ({
        order: () => makeQueryResult(),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as any;
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createFallbackSupabaseClient();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
