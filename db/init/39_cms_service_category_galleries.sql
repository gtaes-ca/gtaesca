INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'residential',
    'gallery',
    '{
      "tagline": "Our Gallery",
      "titleLine1": "Residential Project Gallery",
      "titleLine2": "",
      "buttonText": "",
      "buttonLink": "",
      "items": []
    }'::jsonb
  ),
  (
    'commercial',
    'gallery',
    '{
      "tagline": "Our Gallery",
      "titleLine1": "Commercial Project Gallery",
      "titleLine2": "",
      "buttonText": "",
      "buttonLink": "",
      "items": []
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
