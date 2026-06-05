/*
  Production readiness migration:
  - site_settings table for dynamic configuration
  - testimonials table
  - contact_submissions table
  - breaking_news RLS policies
  - advertisements schema alignment (priority, description)
  - default site settings (no demo content)
*/

-- Site settings (key-value JSON store)
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Authenticated can read site settings" ON site_settings FOR SELECT TO authenticated USING (true);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT '',
  company text DEFAULT '',
  quote text NOT NULL,
  avatar text DEFAULT '',
  featured boolean DEFAULT true,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Public auth can view active testimonials" ON testimonials FOR SELECT TO authenticated USING (is_active = true);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- Breaking news RLS
ALTER TABLE breaking_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published breaking news" ON breaking_news
  FOR SELECT TO anon
  USING (status = 'published' AND publish_date <= now());
CREATE POLICY "Authenticated can view published breaking news" ON breaking_news
  FOR SELECT TO authenticated
  USING (status = 'published' AND publish_date <= now());

-- Align advertisements schema (v1 base + extra fields)
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_advertisements_priority ON advertisements(priority DESC);

-- Default site settings (contact info, motto, stats placeholders)
INSERT INTO site_settings (key, value) VALUES
  ('general', '{
    "websiteName": "Gold-Coast Mining Review",
    "websiteDescription": "Africa''s leading mining intelligence and media platform",
    "motto": "Your Gateway to Africa''s Mining Excellence",
    "editorialEmail": "editorial@goldcoastminingreview.com",
    "contactEmail": "info@goldcoastminingreview.com",
    "salesEmail": "sales@goldcoastminingreview.com",
    "phone": "+27 71 785 6901",
    "officeAddress": "",
    "footerText": "Done / Powered by Steve @ Eva-Tech-Studio"
  }'::jsonb),
  ('social', '{"facebook":"","twitter":"","linkedin":"","instagram":"","youtube":""}'::jsonb),
  ('seo', '{
    "metaTitle": "Gold-Coast Mining Review | Africa''s Mining Intelligence Platform",
    "metaDescription": "Africa''s leading mining intelligence and media platform. Mining News. Data. Intelligence.",
    "keywords": "mining, gold, africa, ghana, resources, investment"
  }'::jsonb),
  ('homepage_stats', '{
    "goldExports": {"value": 0, "prefix": "$", "suffix": "M", "label": "Gold Exports"},
    "miningGrowth": {"value": 0, "suffix": "%", "label": "African Mining Growth"},
    "activeProjects": {"value": 0, "label": "Active Projects"},
    "companiesTracked": {"value": 0, "label": "Companies Tracked"}
  }'::jsonb),
  ('market_indicators', '[]'::jsonb),
  ('chatbot', '{
    "enableChatbot": true,
    "welcomeMessage": "Welcome to Gold-Coast Mining Review. I can help you explore our news, magazines, events, mining company directory, advertising opportunities, and answer questions about the mining industry.",
    "suggestedQuestions": [
      "How can I advertise on Gold-Coast Mining Review?",
      "What mining companies are featured?",
      "Show me the latest mining news",
      "Tell me about upcoming mining events"
    ]
  }'::jsonb),
  ('advertise', '{
    "monthlyReaders": 0,
    "pageViews": 0,
    "newsletterSubscribers": 0
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
