/*
  # Gold-Coast Mining Review - Initial Schema

  1. New Tables
    - `articles` - News articles, investigations, interviews, analysis
      - id, title, slug, excerpt, content, category, featured_image, author_id, published_at, is_premium, tags
    - `authors` - Journalist profiles
      - id, name, title, bio, avatar, social_links
    - `commodities` - Commodity price data and info
      - id, name, symbol, current_price, price_change, price_change_percent, unit, category, icon
    - `commodity_prices` - Historical price data
      - id, commodity_id, price, recorded_at
    - `projects` - Mining projects across Africa
      - id, name, slug, country, minerals, status, company_id, investment_value, description, featured_image
    - `companies` - Mining companies
      - id, name, slug, logo, country, type, description, website, stock_symbol
    - `reports` - Downloadable premium reports
      - id, title, slug, description, category, file_url, cover_image, is_premium, published_at
    - `videos` - Video content
      - id, title, slug, description, thumbnail, video_url, duration, category, published_at
    - `podcasts` - Podcast episodes
      - id, title, slug, description, thumbnail, audio_url, duration, episode_number, published_at
    - `events` - Mining industry events
      - id, title, slug, description, date, location, url, image
    - `jobs` - Job listings
      - id, title, company, location, type, salary_range, description, url, posted_at
    - `newsletter_subscribers` - Newsletter signups
      - id, email, subscribed_at

  2. Security
    - Enable RLS on all tables
    - Public read access for articles, commodities, companies, projects, reports, videos, podcasts, events, jobs
    - Authenticated write access for authors
    - Restricted admin access for newsletter subscribers
*/

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text DEFAULT '',
  bio text DEFAULT '',
  avatar text DEFAULT '',
  social_links jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view authors" ON authors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view authors" ON authors FOR SELECT TO anon USING (true);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  category text DEFAULT 'news',
  featured_image text DEFAULT '',
  author_id uuid REFERENCES authors(id),
  published_at timestamptz DEFAULT now(),
  is_premium boolean DEFAULT false,
  tags text[] DEFAULT '{}'::text[],
  reading_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published articles" ON articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view published articles" ON articles FOR SELECT TO anon USING (true);

-- Commodities table
CREATE TABLE IF NOT EXISTS commodities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text UNIQUE NOT NULL,
  current_price numeric DEFAULT 0,
  price_change numeric DEFAULT 0,
  price_change_percent numeric DEFAULT 0,
  unit text DEFAULT 'USD/oz',
  category text DEFAULT 'precious-metals',
  icon text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view commodities" ON commodities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view commodities" ON commodities FOR SELECT TO anon USING (true);

-- Commodity historical prices
CREATE TABLE IF NOT EXISTS commodity_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_id uuid REFERENCES commodities(id) NOT NULL,
  price numeric NOT NULL,
  recorded_at timestamptz DEFAULT now()
);
ALTER TABLE commodity_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view commodity prices" ON commodity_prices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view commodity prices" ON commodity_prices FOR SELECT TO anon USING (true);

-- Mining companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo text DEFAULT '',
  country text DEFAULT '',
  type text DEFAULT 'mining',
  description text DEFAULT '',
  website text DEFAULT '',
  stock_symbol text DEFAULT '',
  market_cap numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view companies" ON companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view companies" ON companies FOR SELECT TO anon USING (true);

-- Mining projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  country text NOT NULL,
  minerals text[] DEFAULT '{}'::text[],
  status text DEFAULT 'exploration',
  company_id uuid REFERENCES companies(id),
  investment_value numeric DEFAULT 0,
  description text DEFAULT '',
  featured_image text DEFAULT '',
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view projects" ON projects FOR SELECT TO anon USING (true);

-- Premium reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'gold',
  file_url text DEFAULT '',
  cover_image text DEFAULT '',
  is_premium boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view reports" ON reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view reports" ON reports FOR SELECT TO anon USING (true);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  thumbnail text DEFAULT '',
  video_url text DEFAULT '',
  duration integer DEFAULT 0,
  category text DEFAULT 'interview',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view videos" ON videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view videos" ON videos FOR SELECT TO anon USING (true);

-- Podcasts
CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  thumbnail text DEFAULT '',
  audio_url text DEFAULT '',
  duration integer DEFAULT 0,
  episode_number integer DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view podcasts" ON podcasts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view podcasts" ON podcasts FOR SELECT TO anon USING (true);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  date timestamptz DEFAULT now(),
  location text DEFAULT '',
  url text DEFAULT '',
  image text DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view events" ON events FOR SELECT TO anon USING (true);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text DEFAULT '',
  type text DEFAULT 'full-time',
  salary_range text DEFAULT '',
  description text DEFAULT '',
  url text DEFAULT '',
  posted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view jobs" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public anon can view jobs" ON jobs FOR SELECT TO anon USING (true);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can subscribe" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);

-- Insert seed commodity data
INSERT INTO commodities (name, symbol, current_price, price_change, price_change_percent, unit, category) VALUES
  ('Gold', 'XAU', 2341.50, 12.30, 0.53, 'USD/oz', 'precious-metals'),
  ('Copper', 'XCU', 4.32, -0.05, -1.14, 'USD/lb', 'base-metals'),
  ('Lithium', 'LI', 13500.00, -420.00, -3.01, 'USD/tonne', 'battery-metals'),
  ('Platinum', 'XPT', 1012.00, 8.50, 0.85, 'USD/oz', 'precious-metals'),
  ('Cobalt', 'CO', 28500.00, 350.00, 1.24, 'USD/tonne', 'battery-metals'),
  ('Manganese', 'MN', 4.85, 0.12, 2.54, 'USD/dmtu', 'base-metals'),
  ('Bauxite', 'BAU', 52.00, 1.50, 2.97, 'USD/tonne', 'industrial-minerals'),
  ('Diamond', 'DIA', 8500.00, -120.00, -1.39, 'USD/ct', 'gemstones'),
  ('Iron Ore', 'FE', 118.50, 2.30, 1.98, 'USD/tonne', 'base-metals'),
  ('Silver', 'XAG', 29.40, 0.65, 2.26, 'USD/oz', 'precious-metals');

-- Seed authors removed to avoid embedding production/demo content in migrations.
-- Use explicit seed scripts or admin UI to add authors in production environments.

-- Seed articles removed to avoid embedding production/demo content in migrations.
-- Use explicit seed scripts or admin UI to add content in staging/production environments.

-- Insert seed companies
INSERT INTO companies (name, slug, country, type, description, stock_symbol, market_cap) VALUES
  ('AngloGold Ashanti', 'anglogold-ashanti', 'South Africa', 'mining', 'One of the world''s largest gold mining companies with significant African operations.', 'AU', 9500000000),
  ('Newmont Africa', 'newmont-africa', 'Ghana', 'mining', 'Leading gold producer with operations across Ghana and other African nations.', 'NEM', 42000000000),
  ('Gold Fields', 'gold-fields', 'South Africa', 'mining', 'Global gold producer with eight operating mines across three continents.', 'GFI', 12000000000),
  ('Vale', 'vale', 'Brazil', 'mining', 'One of the largest mining companies globally with African coal operations.', 'VALE', 55000000000),
  ('Rio Tinto', 'rio-tinto', 'UK', 'mining', 'Major diversified mining company with operations in Madagascar and Mozambique.', 'RIO', 95000000000),
  ('Chirano Gold Mines', 'chirano-gold', 'Ghana', 'mining', 'Ghana-based gold mining operation owned by Kinross Gold.', '', 1500000000),
  ('Ghana Manganese Company', 'ghana-manganese', 'Ghana', 'mining', 'Leading manganese producer in West Africa.', '', 800000000),
  ('Asante Gold Corporation', 'asante-gold', 'Ghana', 'mining', 'Canadian-listed gold mining company focused on Ghana.', 'SE', 500000000);

-- Insert seed projects
INSERT INTO projects (name, slug, country, minerals, status, company_id, investment_value, description) VALUES
  ('Obuasi Gold Mine', 'obuasi-gold-mine', 'Ghana', ARRAY['gold'], 'operating', (SELECT id FROM companies WHERE slug = 'anglogold-ashanti'), 2000000000, 'One of Ghana''s oldest and most productive gold mines undergoing major redevelopment.'),
  ('Ahafo South Expansion', 'ahafo-south-expansion', 'Ghana', ARRAY['gold'], 'expansion', (SELECT id FROM companies WHERE slug = 'newmont-africa'), 850000000, 'Newmont''s expansion of the Ahafo mine to extend mine life by 10 years.'),
  ('Chirano Mine Extension', 'chirano-mine-extension', 'Ghana', ARRAY['gold'], 'expansion', (SELECT id FROM companies WHERE slug = 'chirano-gold'), 300000000, 'Extension project to access deeper ore bodies at the Chirano mine.'),
  ('Bibiani Gold Project', 'bibiani-gold-project', 'Ghana', ARRAY['gold'], 'development', (SELECT id FROM companies WHERE slug = 'asante-gold'), 250000000, 'Advanced-stage gold project in western Ghana.'),
  ('Nsuta Manganese Mine', 'nsuta-manganese', 'Ghana', ARRAY['manganese'], 'operating', (SELECT id FROM companies WHERE slug = 'ghana-manganese'), 150000000, 'One of the world''s richest manganese deposits.'),
  ('Kibali Gold Mine', 'kibali-gold', 'DRC', ARRAY['gold'], 'operating', (SELECT id FROM companies WHERE slug = 'anglogold-ashanti'), 1800000000, 'Africa''s largest gold mine located in northeastern DRC.'),
  ('Katanga Copper-Cobalt', 'katanga-copper-cobalt', 'DRC', ARRAY['copper', 'cobalt'], 'operating', NULL, 2600000000, 'Major copper-cobalt operation in the Katanga province.'),
  ('Mbalam Iron Ore', 'mbalam-iron-ore', 'Cameroon', ARRAY['iron-ore'], 'development', NULL, 3500000000, 'Large-scale iron ore project straddling Cameroon and Congo.');

-- Insert seed reports
INSERT INTO reports (title, slug, description, category, is_premium) VALUES
  ('Ghana Gold Outlook 2026', 'ghana-gold-outlook-2026', 'Comprehensive analysis of Ghana''s gold mining sector including production forecasts and investment opportunities.', 'gold', true),
  ('African Lithium Market Report', 'african-lithium-report', 'Deep dive into Africa''s emerging lithium sector covering exploration, projects, and supply chain dynamics.', 'lithium', true),
  ('Mining ESG Compliance in Africa', 'mining-esg-compliance-africa', 'Assessment of ESG practices across major African mining operations and regulatory frameworks.', 'esg', true),
  ('West Africa Mining Investment Guide', 'west-africa-mining-investment', 'Investor''s guide to mining opportunities across West Africa with risk assessment and market analysis.', 'investment', true),
  ('Copper & Cobalt: DRC Market Analysis', 'drc-copper-cobalt-analysis', 'Market analysis of the DRC''s copper and cobalt sectors including production data and trade flows.', 'copper', false),
  ('Commodity Price Forecast Q3 2026', 'commodity-forecast-q3-2026', 'Quarterly commodity price forecasts for precious metals, base metals, and battery minerals.', 'forecast', true);

-- Insert seed videos
INSERT INTO videos (title, slug, description, category, duration) VALUES
  ('Inside Obuasi: Ghana''s Gold Renaissance', 'inside-obuasi-gold', 'A documentary exploring the transformation of AngloGold Ashanti''s Obuasi mine.', 'documentary', 1842),
  ('CEO Talk: Mining Leadership in Africa', 'ceo-talk-mining-leadership', 'Exclusive interview series with Africa''s top mining executives.', 'interview', 2400),
  ('Lithium Revolution: West Africa''s New Frontier', 'lithium-revolution-west-africa', 'Exploring the lithium exploration boom across West Africa.', 'documentary', 1560),
  ('Market Pulse: Weekly Commodity Analysis', 'market-pulse-weekly', 'Weekly analysis of commodity price movements and market trends.', 'analysis', 900);

-- Insert seed podcasts
INSERT INTO podcasts (title, slug, description, episode_number, duration) VALUES
  ('The State of African Mining', 'state-of-african-mining', 'A comprehensive overview of the current mining landscape across the African continent.', 1, 2700),
  ('Gold and Governance', 'gold-and-governance', 'Examining the relationship between gold mining and governance in West Africa.', 2, 2400),
  ('Battery Minerals and Africa''s Future', 'battery-minerals-africa-future', 'How battery mineral demand is reshaping African mining investment.', 3, 3000),
  ('Mining Finance Explained', 'mining-finance-explained', 'Understanding the financial mechanisms behind major mining projects.', 4, 1800);

-- Insert seed events
INSERT INTO events (title, slug, description, date, location) VALUES
  ('Africa Mining Indaba 2026', 'africa-mining-indaba-2026', 'The world''s largest mining investment conference focused on Africa.', '2026-02-02', 'Cape Town, South Africa'),
  ('Ghana Mining Expo 2026', 'ghana-mining-expo-2026', 'Ghana''s premier mining exhibition and conference.', '2026-06-15', 'Accra, Ghana'),
  ('PDAC 2026', 'pdac-2026', 'The Prospectors & Developers Association of Canada convention.', '2026-03-01', 'Toronto, Canada'),
  ('Mining Indaba West Africa', 'mining-indaba-west-africa', 'Regional mining investment conference for West Africa.', '2026-09-20', 'Abuja, Nigeria');

-- Insert seed jobs
INSERT INTO jobs (title, company, location, type, salary_range, description) VALUES
  ('Senior Mining Engineer', 'AngloGold Ashanti', 'Obuasi, Ghana', 'full-time', '$80,000 - $120,000', 'Experienced mining engineer for underground operations.'),
  ('Geologist - Exploration', 'Newmont Africa', 'Accra, Ghana', 'full-time', '$65,000 - $95,000', 'Lead geologist for greenfield exploration programs.'),
  ('ESG Manager', 'Gold Fields', 'Johannesburg, South Africa', 'full-time', '$90,000 - $130,000', 'Manage ESG compliance and sustainability programs.'),
  ('Data Analyst - Mining Operations', 'Rio Tinto', 'Maputo, Mozambique', 'full-time', '$55,000 - $85,000', 'Analytical role supporting data-driven mining operations.'),
  ('Mining Safety Officer', 'Chirano Gold Mines', 'Chirano, Ghana', 'full-time', '$45,000 - $70,000', 'Ensure safety compliance across all mining operations.');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_commodities_category ON commodities(category);
CREATE INDEX IF NOT EXISTS idx_commodity_prices_commodity ON commodity_prices(commodity_id);
CREATE INDEX IF NOT EXISTS idx_commodity_prices_recorded ON commodity_prices(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_country ON projects(country);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
