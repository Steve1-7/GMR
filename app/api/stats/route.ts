import { NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET() {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const tables = ['articles', 'magazines', 'companies', 'events', 'podcasts', 'videos', 'jobs', 'projects', 'reports', 'breaking_news', 'advertisements', 'newsletter_subscribers'] as const;

    const counts: Record<string, number> = {};
    await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
        counts[table] = error ? 0 : (count ?? 0);
      })
    );

    const { data: settings } = await db.from('site_settings').select('key, value').eq('key', 'homepage_stats').single();

    return NextResponse.json({
      data: {
        counts,
        homepageStats: settings?.value ?? null,
      },
    });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
