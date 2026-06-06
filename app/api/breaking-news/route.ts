import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';
import requireAdmin from '@/lib/admin-auth';

export async function GET() {
  const db = getAdminClient();
  if (!db) {
    console.error('Database client unavailable in /api/breaking-news GET');
    return dbUnavailable();
  }

  try {
    const { data, error } = await db
      .from('breaking_news')
      .select('*')
      .eq('status', 'published')
      .lte('publish_date', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching breaking news:', error);
      return dbError('Error fetching breaking news', error);
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error in GET /api/breaking-news', err);
    return dbError('Unexpected error', err);
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const db = getAdminClient();
  if (!db) {
    console.error('Database client unavailable in /api/breaking-news POST');
    return dbUnavailable();
  }

  try {
    const body = await request.json();
    const { headline, summary, featured_image, article_url, publish_date, status, priority } = body;

    const { data, error } = await db.from('breaking_news').insert([{ headline, summary, featured_image, article_url, publish_date, status, priority }]).select();

    if (error) {
      console.error('Error creating breaking news:', error);
      return dbError('Error creating breaking news', error);
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST /api/breaking-news', err);
    return dbError('Unexpected error', err);
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const db = getAdminClient();
  if (!db) {
    console.error('Database client unavailable in /api/breaking-news PUT');
    return dbUnavailable();
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data, error } = await db.from('breaking_news').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select();

    if (error) {
      console.error('Error updating breaking news:', error);
      return dbError('Error updating breaking news', error);
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error in PUT /api/breaking-news', err);
    return dbError('Unexpected error', err);
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const db = getAdminClient();
  if (!db) {
    console.error('Database client unavailable in /api/breaking-news DELETE');
    return dbUnavailable();
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await db.from('breaking_news').delete().eq('id', id);
    if (error) {
      console.error('Error deleting breaking news:', error);
      return dbError('Error deleting breaking news', error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/breaking-news', err);
    return dbError('Unexpected error', err);
  }
}
