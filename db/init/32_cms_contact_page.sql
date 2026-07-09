INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.contact', '/management/cms/contact', 'Contact Page', 'cms', 'Website CMS', 124)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.contact'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'contact',
    'banner',
    '{
      "title": "Contact",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'contact',
    'settings',
    '{
      "formTitle": "Get A Free Quote",
      "recipientEmail": "example@gamil.com",
      "phone": "+55 827 057 5405",
      "displayEmail": "example@gamil.com",
      "address": "12 Green Road, 05 New York",
      "latitude": 43.6532,
      "longitude": -79.3832,
      "mapZoom": 14
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
