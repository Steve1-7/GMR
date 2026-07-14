-- Fix RLS policies for all content tables to allow admin operations
-- This migration adds INSERT, UPDATE, DELETE policies for authenticated users

-- Articles
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
DROP POLICY IF EXISTS "Public anon can view published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated can view published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated can delete articles" ON articles;

CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT TO anon
  USING (published_at <= now());

CREATE POLICY "Authenticated can view published articles" ON articles
  FOR SELECT TO authenticated
  USING (published_at <= now());

CREATE POLICY "Authenticated can insert articles" ON articles
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update articles" ON articles
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete articles" ON articles
  FOR DELETE TO authenticated
  USING (true);

-- Companies
DROP POLICY IF EXISTS "Public can view companies" ON companies;
DROP POLICY IF EXISTS "Public anon can view companies" ON companies;
DROP POLICY IF EXISTS "Authenticated can view companies" ON companies;
DROP POLICY IF EXISTS "Authenticated can insert companies" ON companies;
DROP POLICY IF EXISTS "Authenticated can update companies" ON companies;
DROP POLICY IF EXISTS "Authenticated can delete companies" ON companies;

CREATE POLICY "Public can view companies" ON companies
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can view companies" ON companies
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert companies" ON companies
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update companies" ON companies
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete companies" ON companies
  FOR DELETE TO authenticated
  USING (true);

-- Events
DROP POLICY IF EXISTS "Public can view events" ON events;
DROP POLICY IF EXISTS "Public anon can view events" ON events;
DROP POLICY IF EXISTS "Authenticated can view events" ON events;
DROP POLICY IF EXISTS "Authenticated can insert events" ON events;
DROP POLICY IF EXISTS "Authenticated can update events" ON events;
DROP POLICY IF EXISTS "Authenticated can delete events" ON events;

CREATE POLICY "Public can view events" ON events
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can view events" ON events
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert events" ON events
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update events" ON events
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete events" ON events
  FOR DELETE TO authenticated
  USING (true);

-- Magazines
DROP POLICY IF EXISTS "Public can view magazines" ON magazines;
DROP POLICY IF EXISTS "Public anon can view magazines" ON magazines;
DROP POLICY IF EXISTS "Authenticated can view magazines" ON magazines;
DROP POLICY IF EXISTS "Authenticated can insert magazines" ON magazines;
DROP POLICY IF EXISTS "Authenticated can update magazines" ON magazines;
DROP POLICY IF EXISTS "Authenticated can delete magazines" ON magazines;

CREATE POLICY "Public can view magazines" ON magazines
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated can view magazines" ON magazines
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert magazines" ON magazines
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update magazines" ON magazines
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete magazines" ON magazines
  FOR DELETE TO authenticated
  USING (true);

-- Podcasts
DROP POLICY IF EXISTS "Public can view podcasts" ON podcasts;
DROP POLICY IF EXISTS "Public anon can view podcasts" ON podcasts;
DROP POLICY IF EXISTS "Authenticated can view podcasts" ON podcasts;
DROP POLICY IF EXISTS "Authenticated can insert podcasts" ON podcasts;
DROP POLICY IF EXISTS "Authenticated can update podcasts" ON podcasts;
DROP POLICY IF EXISTS "Authenticated can delete podcasts" ON podcasts;

CREATE POLICY "Public can view podcasts" ON podcasts
  FOR SELECT TO anon
  USING (published_at <= now());

CREATE POLICY "Authenticated can view podcasts" ON podcasts
  FOR SELECT TO authenticated
  USING (published_at <= now());

CREATE POLICY "Authenticated can insert podcasts" ON podcasts
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update podcasts" ON podcasts
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete podcasts" ON podcasts
  FOR DELETE TO authenticated
  USING (true);

-- Videos
DROP POLICY IF EXISTS "Public can view videos" ON videos;
DROP POLICY IF EXISTS "Public anon can view videos" ON videos;
DROP POLICY IF EXISTS "Authenticated can view videos" ON videos;
DROP POLICY IF EXISTS "Authenticated can insert videos" ON videos;
DROP POLICY IF EXISTS "Authenticated can update videos" ON videos;
DROP POLICY IF EXISTS "Authenticated can delete videos" ON videos;

CREATE POLICY "Public can view videos" ON videos
  FOR SELECT TO anon
  USING (published_at <= now());

CREATE POLICY "Authenticated can view videos" ON videos
  FOR SELECT TO authenticated
  USING (published_at <= now());

CREATE POLICY "Authenticated can insert videos" ON videos
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update videos" ON videos
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete videos" ON videos
  FOR DELETE TO authenticated
  USING (true);

-- Advertisements
DROP POLICY IF EXISTS "Public can view active advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public can view advertisements" ON advertisements;
DROP POLICY IF EXISTS "Public anon can view advertisements" ON advertisements;
DROP POLICY IF EXISTS "Authenticated can view advertisements" ON advertisements;
DROP POLICY IF EXISTS "Authenticated can insert advertisements" ON advertisements;
DROP POLICY IF EXISTS "Authenticated can update advertisements" ON advertisements;
DROP POLICY IF EXISTS "Authenticated can delete advertisements" ON advertisements;

CREATE POLICY "Public can view active advertisements" ON advertisements
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view advertisements" ON advertisements
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert advertisements" ON advertisements
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update advertisements" ON advertisements
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete advertisements" ON advertisements
  FOR DELETE TO authenticated
  USING (true);

-- Banners
DROP POLICY IF EXISTS "Public can view active banners" ON banners;
DROP POLICY IF EXISTS "Public can view banners" ON banners;
DROP POLICY IF EXISTS "Public anon can view banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can view banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can insert banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can update banners" ON banners;
DROP POLICY IF EXISTS "Authenticated can delete banners" ON banners;

CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view banners" ON banners
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert banners" ON banners
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update banners" ON banners
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete banners" ON banners
  FOR DELETE TO authenticated
  USING (true);
