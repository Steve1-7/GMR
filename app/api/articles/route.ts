import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const nextUrl = request.nextUrl;
    const limitParam = nextUrl.searchParams.get('limit');
    const slug = nextUrl.searchParams.get('slug');
    const category = nextUrl.searchParams.get('category');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    let query = db
      .from('articles')
      .select('*, authors(name, title)')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    if (slug) {
      query = query.eq('slug', slug).limit(1);
    } else {
      if (category) query = query.eq('category', category);
      query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) return dbError('Error fetching articles', error);

    const mapped = (data || []).map((article: Record<string, unknown>) => ({
      ...article,
      author: (article.authors as { name?: string } | null)?.name || null,
      author_title: (article.authors as { title?: string } | null)?.title || null,
      image: article.featured_image,
      readingTime: article.reading_time,
    }));

    return NextResponse.json({ data: mapped });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
