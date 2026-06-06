import { NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET() {
  const db = getAdminClient();
  if (!db) {
    console.error('Database client unavailable in /api/stats');
    return dbUnavailable();
  }

  try {
    const tables = ['articles', 'magazines', 'companies', 'events', 'podcasts', 'videos', 'jobs', 'projects', 'reports', 'breaking_news', 'advertisements', 'newsletter_subscribers'] as const;

    const counts: Record<string, number> = {};
    await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
        if (error) {
          console.error(`Error counting ${table}:`, error);
        }
        counts[table] = error ? 0 : (count ?? 0);
      })
    );

    const { data: settings, error: settingsError } = await db.from('site_settings').select('key, value').eq('key', 'homepage_stats').single();
    if (settingsError) {
      console.error('Error fetching homepage_stats:', settingsError);
    }

    return NextResponse.json({
      data: {
        counts,
        homepageStats: settings?.value ?? null,
      },
    });
  } catch (err) {
    console.error('Unexpected error in /api/stats:', err);
    return dbError('Unexpected error', err);
  }
}
