Local development and build instructions

1) Copy `.env.example` to `.env.local` and fill in values (Supabase project URL, anon key, service role key, ADMIN_API_SECRET).

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local -Force
notepad .env.local
# edit values, save
npm install
npm run dev
```

macOS / Linux:

```bash
cp .env.example .env.local
nano .env.local
# edit values, save
npm install
npm run dev
```

To run a production build locally:

```bash
# ensure .env.local is present and populated
npm run build
npm run start
```

Notes:
- The app expects `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for admin APIs.
- Admin-protected server routes accept a Bearer access token with an admin role in Supabase app metadata, or the legacy `x-admin-secret` header matching `ADMIN_API_SECRET`.
