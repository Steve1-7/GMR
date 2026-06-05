import { NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET() {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const { data, error } = await db
      .from('commodities')
      .select('*')
      .order('name', { ascending: true });

    if (error) return dbError('Error fetching commodities', error);
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
