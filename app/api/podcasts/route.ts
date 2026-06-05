import { NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET() {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const { data, error } = await db
      .from('podcasts')
      .select('*')
      .order('episode_number', { ascending: false });

    if (error) return dbError('Error fetching podcasts', error);
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
