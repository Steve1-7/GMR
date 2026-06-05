import { NextRequest, NextResponse } from 'next/server';
import supabaseAdmin from './supabase-admin';

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || '';

export async function requireAdmin(request: NextRequest) {
  // Prefer bearer token verification via Supabase if available
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data || !data.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = data.user as any;
        // Accept users with explicit 'admin' role in app metadata
        const role = user?.app_metadata?.role || user?.user_metadata?.role;
        if (role === 'admin') return null;
        // If no explicit role, reject
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } catch (err) {
        console.error('Error verifying bearer token in requireAdmin', err);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  // Fallback to legacy x-admin-secret header when Supabase admin client is not configured
  const secret = request.headers.get('x-admin-secret') || '';
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

export default requireAdmin;
