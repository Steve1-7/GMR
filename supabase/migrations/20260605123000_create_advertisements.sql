-- Deprecated: advertisements table created in 20260603_002_add_missing_tables.sql
-- This migration only adds optional columns if missing
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0;
