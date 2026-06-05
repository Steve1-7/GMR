import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const featured = request.nextUrl.searchParams.get('featured');
    let query = db.from('companies').select('*').order('featured', { ascending: false });

    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;
    if (error) return dbError('Error fetching companies', error);
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
