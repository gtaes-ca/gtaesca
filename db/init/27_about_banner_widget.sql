INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'about',
    'banner',
    '{
      "title": "About Us",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
