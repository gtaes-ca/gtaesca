INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'services',
    'homepage-section',
    '{
      "tagline": "What We Do",
      "titleLine1": "Featured Electrical Services",
      "titleLine2": "for Your Home & Business"
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;

-- Prefer legacy featured-services titles when homepage-section was just seeded empty of custom edits
UPDATE web_content_widgets AS target
SET content = jsonb_build_object(
  'tagline', CASE
    WHEN COALESCE(source.content->>'tagline', '') IN ('', 'Our Services') THEN 'What We Do'
    ELSE source.content->>'tagline'
  END,
  'titleLine1', COALESCE(NULLIF(source.content->>'titleLine1', ''), 'Featured Electrical Services'),
  'titleLine2', COALESCE(source.content->>'titleLine2', 'for Your Home & Business')
)
FROM web_content_widgets AS source
WHERE target.page = 'services'
  AND target.section = 'homepage-section'
  AND source.page = 'home'
  AND source.section = 'featured-services'
  AND COALESCE(target.content->>'titleLine1', '') IN ('', 'Featured Electrical Services')
  AND COALESCE(target.content->>'tagline', '') IN ('', 'What We Do', 'Our Services');
