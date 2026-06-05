import { NextRequest, NextResponse } from 'next/server';
import requireAdmin from '@/lib/admin-auth';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const key = request.nextUrl.searchParams.get('key');
    let query = db.from('site_settings').select('key, value');

    if (key) {
      query = query.eq('key', key);
    }

    const { data, error } = await query;
    if (error) return dbError('Error fetching settings', error);

    if (key) {
      const row = data?.[0];
      return NextResponse.json({ data: row?.value ?? null });
    }

    const settings: Record<string, unknown> = {};
    (data || []).forEach((row: { key: string; value: unknown }) => {
      settings[row.key] = row.value;
    });
    return NextResponse.json({ data: settings });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const body = await request.json();
    const { key, value } = body;
    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

    const { data, error } = await db
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) return dbError('Error saving settings', error);
    return NextResponse.json({ data });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
