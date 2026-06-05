import { NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET() {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const { data, error } = await db
      .from('magazines')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return dbError('Error fetching magazines', error);
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
