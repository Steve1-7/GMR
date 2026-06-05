-- Migration: create breaking_news table
-- Run this migration against your Supabase/Postgres instance

CREATE TABLE IF NOT EXISTS breaking_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text NOT NULL,
  summary text,
  featured_image text,
  article_url text,
  publish_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'draft', -- draft | published
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_breaking_news_publish_date ON breaking_news (publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_breaking_news_priority ON breaking_news (priority DESC);
