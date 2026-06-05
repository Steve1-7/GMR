#!/usr/bin/env node
// Usage: node scripts/create_admin_user.js <user_id>
// This script sets app_metadata.role = 'admin' for a Supabase user using service role key.
const fetch = require('node-fetch');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const userId = process.argv[2];
if (!userId) {
  console.error('Provide user id as first arg');
  process.exit(1);
}

(async () => {
  try {
    const url = `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/admin/users/${userId}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ app_metadata: { role: 'admin' } })
    });
    const json = await res.json();
    console.log(json);
  } catch (err) {
    console.error('Error:', err);
  }
})();
