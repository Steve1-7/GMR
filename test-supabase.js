// Test Supabase connection
const SUPABASE_URL = 'https://zyzoercofsinorvyqtca.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x6YQA23OCJWpAx1Hvlws-A_vt8ZPlFI';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', SUPABASE_URL);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Connection successful!');
      console.log('Status:', response.status);
    } else {
      console.log('❌ Connection failed');
      console.log('Status:', response.status);
      console.log('Error:', await response.text());
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    console.log('This is likely a CORS issue. Configure CORS in your Supabase dashboard.');
  }
}

testConnection();
