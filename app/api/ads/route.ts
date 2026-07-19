import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getContentClient } from '@/lib/api-utils';

function mapAd(ad: Record<string, unknown>) {
  return {
    id: ad.id,
    title: ad.title,
    description: ad.description || '',
    company_name: ad.company_name,
    company: ad.company_name,
    image: ad.image_url,
    image_url: ad.image_url,
    url: ad.link_url,
    link_url: ad.link_url,
    type: ad.type,
    category: ad.category,
    active: ad.is_active,
    is_active: ad.is_active,
    priority: ad.priority ?? 0,
    position: ad.type,
  };
}

export async function GET(request: NextRequest) {
  const db = getContentClient();
  if (!db) {
    console.error('Database client unavailable in /api/ads');
    return dbUnavailable();
  }

  try {
    const type = request.nextUrl.searchParams.get('type');
    let query = db
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.limit(20);
    if (error) {
      const fallbackQuery = db
        .from('advertisements')
        .select('*')
        .eq('is_active', true);

      const { data: fallbackData, error: fallbackError } = type
        ? await fallbackQuery.eq('type', type).limit(20)
        : await fallbackQuery.limit(20);

      if (fallbackError) {
        console.error('Error fetching ads:', error);
        return dbError('Error fetching ads', error);
      }

      return NextResponse.json({ data: (fallbackData || []).map(mapAd) });
    }

    const now = new Date();
    const filtered = (data || []).filter((ad: Record<string, unknown>) => {
      const start = ad.start_date as string | undefined;
      const end = ad.end_date as string | undefined;
      // Only filter if dates are explicitly set
      if (start && new Date(start) > now) return false;
      if (end && new Date(end) < now) return false;
      return true;
    });

    console.log('Filtered ads:', filtered.length, 'out of', data?.length);
    return NextResponse.json({ data: filtered.map(mapAd) });
  } catch (err) {
    console.error('Unexpected error in /api/ads:', err);
    return dbError('Unexpected error', err);
  }
}
