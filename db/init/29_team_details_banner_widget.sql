INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'team-details',
    'banner',
    '{
      "title": "Member Details",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
