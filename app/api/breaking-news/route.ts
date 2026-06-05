import { NextRequest, NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabase-admin';
import requireAdmin from '@/lib/admin-auth';

export async function GET() {
  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured for /api/breaking-news');
    return NextResponse.json({ error: 'Server misconfiguration: supabase admin client unavailable' }, { status: 500 });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('breaking_news')
      .select('*')
      .eq('status', 'published')
      .lte('publish_date', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('publish_date', { ascending: false });

    if (error) {
      console.error('Error fetching breaking news:', error);
      return NextResponse.json({ error: 'Error fetching breaking news' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error in GET /api/breaking-news', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured for POST /api/breaking-news');
    return NextResponse.json({ error: 'Server misconfiguration: supabase admin client unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { headline, summary, featured_image, article_url, publish_date, status, priority } = body;

    const { data, error } = await supabaseAdmin.from('breaking_news').insert([{ headline, summary, featured_image, article_url, publish_date, status, priority }]).select();

    if (error) {
      console.error('Error creating breaking news:', error);
      return NextResponse.json({ error: 'Error creating item' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error in POST /api/breaking-news', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured for PUT /api/breaking-news');
    return NextResponse.json({ error: 'Server misconfiguration: supabase admin client unavailable' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { data, error } = await supabaseAdmin.from('breaking_news').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select();

    if (error) {
      console.error('Error updating breaking news:', error);
      return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Unexpected error in PUT /api/breaking-news', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  if (!supabaseAdmin) {
    console.error('supabaseAdmin not configured for DELETE /api/breaking-news');
    return NextResponse.json({ error: 'Server misconfiguration: supabase admin client unavailable' }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await supabaseAdmin.from('breaking_news').delete().eq('id', id);
    if (error) {
      console.error('Error deleting breaking news:', error);
      return NextResponse.json({ error: 'Error deleting item' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error in DELETE /api/breaking-news', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
