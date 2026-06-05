import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

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
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const type = request.nextUrl.searchParams.get('type');
    let query = db
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.limit(20);
    if (error) return dbError('Error fetching ads', error);

    const now = new Date();
    const filtered = (data || []).filter((ad: Record<string, unknown>) => {
      const start = ad.start_date as string | undefined;
      const end = ad.end_date as string | undefined;
      if (start && new Date(start) > now) return false;
      if (end && new Date(end) < now) return false;
      return true;
    });

    return NextResponse.json({ data: filtered.map(mapAd) });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
