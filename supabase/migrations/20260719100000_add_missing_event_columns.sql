-- Add missing columns to events table for frontend compatibility
ALTER TABLE events ADD COLUMN IF NOT EXISTS category text DEFAULT 'Conference';
ALTER TABLE events ADD COLUMN IF NOT EXISTS attendees integer DEFAULT 0;
