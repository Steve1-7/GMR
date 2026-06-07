import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const podcastsOnly = request.nextUrl.searchParams.get('podcasts');
    let query = db.from('videos').select('*').order('published_at', { ascending: false });

    if (podcastsOnly === 'true') {
      query = query.eq('is_podcast', true);
    } else if (podcastsOnly === 'false') {
      query = query.eq('is_podcast', false);
    }

    const { data, error } = await query;
    if (error) return dbError('Error fetching videos', error);
    return NextResponse.json({ data: data || [] });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
