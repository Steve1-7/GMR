import { NextRequest, NextResponse } from 'next/server';
import { dbError, dbUnavailable, getAdminClient } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  const db = getAdminClient();
  if (!db) return dbUnavailable();

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { data, error } = await db
      .from('contact_submissions')
      .insert([{ name: name.trim(), email: email.trim(), subject: subject?.trim() || '', message: message.trim() }])
      .select()
      .single();

    if (error) return dbError('Error submitting contact form', error);
    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch (err) {
    return dbError('Unexpected error', err);
  }
}
