INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'about',
    'credentials',
    '{
      "title": "Licensed & Certified",
      "esaLicenseNumber": "#7014495",
      "items": [
        {
          "image": "assets/images/brand/esa-logo.svg",
          "label": "ESA Licensed"
        },
        {
          "image": "assets/images/brand/wsib-logo.svg",
          "label": "WSIB Certified"
        }
      ]
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
