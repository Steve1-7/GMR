-- Update phone number and add office address details
UPDATE site_settings
SET value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          value,
          '{phone}',
          '"+2332433352901"'::jsonb
        ),
        '{officeAddress}',
        '"Kuma Office"'::jsonb
      ),
      '{officeAddress2}',
      '"P O Box 31, Ejisu-Ashanti"'::jsonb
    ),
    '{gpsAddress}',
      '"AE -0018-2670"'::jsonb
    ),
    '{mapAddress}',
      '"2 Libration Road Airport City Ghana"'::jsonb
  )
WHERE key = 'general';
