DROP POLICY IF EXISTS "Public can view published breaking news" ON breaking_news;
DROP POLICY IF EXISTS "Authenticated can view published breaking news" ON breaking_news;
DROP POLICY IF EXISTS "Authenticated can insert breaking news" ON breaking_news;
DROP POLICY IF EXISTS "Authenticated can update breaking news" ON breaking_news;
DROP POLICY IF EXISTS "Authenticated can delete breaking news" ON breaking_news;

-- Recreate SELECT policies
CREATE POLICY "Public can view published breaking news" ON breaking_news
  FOR SELECT TO anon
  USING (status = 'published' AND publish_date <= now());

CREATE POLICY "Authenticated can view published breaking news" ON breaking_news
  FOR SELECT TO authenticated
  USING (status = 'published' AND publish_date <= now());

-- Add INSERT policy for authenticated users (admin operations)
CREATE POLICY "Authenticated can insert breaking news" ON breaking_news
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Add UPDATE policy for authenticated users (admin operations)
CREATE POLICY "Authenticated can update breaking news" ON breaking_news
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users (admin operations)
CREATE POLICY "Authenticated can delete breaking news" ON breaking_news
  FOR DELETE TO authenticated
  USING (true);