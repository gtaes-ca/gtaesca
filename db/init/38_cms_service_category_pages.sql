-- Residential & Commercial service category pages (CMS banners + details)
INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'residential',
    'banner',
    '{
      "title": "Residential Services",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'residential',
    'details',
    '{
      "tagline": "Residential",
      "title": "Home Electrical Services",
      "text": "Licensed electrical work for homes across the Greater Toronto Area — repairs, upgrades, lighting, EV chargers, and more."
    }'::jsonb
  ),
  (
    'commercial',
    'banner',
    '{
      "title": "Commercial Services",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'commercial',
    'details',
    '{
      "tagline": "Commercial",
      "title": "Commercial Electrical Services",
      "text": "Reliable electrical solutions for offices, retail, warehouses, and commercial properties across the GTA."
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;

-- Prefer existing Services banner title/image for Residential when still empty
UPDATE web_content_widgets AS target
SET content = jsonb_build_object(
  'title', COALESCE(NULLIF(target.content->>'title', ''), source.content->>'title', 'Residential Services'),
  'backgroundImage', COALESCE(NULLIF(target.content->>'backgroundImage', ''), source.content->>'backgroundImage', '')
)
FROM web_content_widgets AS source
WHERE target.page = 'residential'
  AND target.section = 'banner'
  AND source.page = 'services'
  AND source.section = 'banner'
  AND (
    COALESCE(target.content->>'title', '') IN ('', 'Residential Services')
    OR COALESCE(target.content->>'backgroundImage', '') = ''
  );

UPDATE admin_pages
SET label = 'Services Pages'
WHERE key = 'management.cms.services';
