/*
  # Gold-Coast Mining Review - Add Missing Tables
  
  This migration adds:
  - `magazines` table for magazine publications
  - `banners` table for home page banners
  - `advertisements` table for advertising content
  - Update `companies` table with new category structure
*/

-- Magazines table
CREATE TABLE IF NOT EXISTS magazines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issue text NOT NULL,
  date text NOT NULL,
  cover_image text NOT NULL,
  pdf_url text NOT NULL,
  description text DEFAULT '',
  featured boolean DEFAULT false,
  categories text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view magazines" ON magazines;
DROP POLICY IF EXISTS "Public anon can view magazines" ON magazines;
CREATE POLICY "Public can view magazines" ON magazines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view magazines" ON magazines FOR SELECT TO anon USING (true);

-- Banners table for home page
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  image_url text NOT NULL,
  link_url text DEFAULT '',
  cta_text text DEFAULT '',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Public anon can view banners" ON banners;
CREATE POLICY "Public can view banners" ON banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view banners" ON banners FOR SELECT TO anon USING (true);

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  company_logo text DEFAULT '',
  image_url text DEFAULT '',
  link_url text DEFAULT '',
  type text NOT NULL, -- 'banner', 'sidebar', 'sponsored', 'featured'
  category text DEFAULT '',
  is_active boolean DEFAULT true,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public anon can view advertisements" ON advertisements;
CREATE POLICY "Public can view advertisements" ON advertisements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view advertisements" ON advertisements FOR SELECT TO anon USING (true);

-- Update companies table with new category structure
ALTER TABLE companies ADD COLUMN IF NOT EXISTS category text DEFAULT 'Mining Services';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS hq text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS employees text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS founded integer;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS projects integer DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS regions text[] DEFAULT '{}'::text[];
ALTER TABLE companies ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS focus text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stock_symbol text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS exchange text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS market_cap text DEFAULT '';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS market_cap_num numeric DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS change numeric DEFAULT 0;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS initials text DEFAULT '';

-- Update videos table to support integrated video/podcast content
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_podcast boolean DEFAULT false;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS audio_url text DEFAULT '';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_magazines_featured ON magazines(featured);
CREATE INDEX IF NOT EXISTS idx_magazines_date ON magazines(date);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active, type);
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category);
CREATE INDEX IF NOT EXISTS idx_companies_featured ON companies(featured);
CREATE INDEX IF NOT EXISTS idx_videos_is_podcast ON videos(is_podcast);

-- Insert sample data for banners
INSERT INTO banners (title, subtitle, image_url, link_url, cta_text, display_order) VALUES
('Gold Mining Excellence', 'Leading African Mining Operations', '/home/11.jpg', '/news', 'Explore More', 1),
('Sustainable Mining', 'Environmental Responsibility in Mining', '/home/12.jpg', '/news', 'Learn More', 2),
('Investment Opportunities', 'Mining Investment Across Africa', '/home/IMG-20260603-WA0055.jpg', '/companies', 'Discover', 3)
ON CONFLICT DO NOTHING;

-- Insert sample data for magazines
INSERT INTO magazines (title, issue, date, cover_image, pdf_url, description, featured, categories) VALUES
('Gold-Coast Mining Review', 'May 2026 Edition', 'May 2026', '/news/Quarterly Magazines.webp', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'This month''s edition features exclusive insights into Ghana''s gold mining surge, lithium exploration in West Africa, and comprehensive market analysis.', true, ARRAY['Gold', 'Market Analysis', 'Exploration']),
('Gold-Coast Mining Review', 'April 2026 Edition', 'April 2026', '/news/Latest News.jpeg', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Focus on sustainable mining practices, copper market trends, and investment opportunities across the African continent.', false, ARRAY['Sustainability', 'Copper', 'Investment']),
('Gold-Coast Mining Review', 'March 2026 Edition', 'March 2026', '/news/Market reports.jpg', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Special report on lithium mining boom, renewable energy in mining operations, and technology innovations.', false, ARRAY['Lithium', 'Technology', 'Energy'])
ON CONFLICT DO NOTHING;

-- Update existing companies with new category structure
UPDATE companies SET category = 'Mining Services' WHERE type = 'Major' OR type = 'Mid-Tier';
UPDATE companies SET category = 'Engineering Firms' WHERE type = 'Diversified Major';
UPDATE companies SET category = 'Exploration Companies' WHERE type = 'Junior';
