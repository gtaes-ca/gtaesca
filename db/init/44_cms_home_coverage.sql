INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'home',
    'coverage',
    '{
      "tagline": "Service Coverage",
      "titleLine1": "Areas We Serve Across the GTA",
      "titleLine2": "",
      "text": "Licensed electrical service throughout the Greater Toronto Area and nearby communities.",
      "gtaLabel": "Greater Toronto Area",
      "nearbyLabel": "Nearby Areas"
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
