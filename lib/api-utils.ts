import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';

export function dbUnavailable() {
  return NextResponse.json(
    { error: 'Server misconfiguration: database unavailable' },
    { status: 500 }
  );
}

export function dbError(message: string, error?: unknown) {
  if (error) console.error(message, error);
  return NextResponse.json({ error: message }, { status: 500 });
}

export function getAdminClient() {
  if (!supabaseAdmin) return null;
  return supabaseAdmin;
}
