-- Update phone number in site_settings
UPDATE site_settings
SET value = jsonb_set(
  value,
  '{phone}',
  '"+233243352901"'::jsonb
)
WHERE key = 'general';
