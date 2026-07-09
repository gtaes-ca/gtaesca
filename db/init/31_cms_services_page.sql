INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.services', '/management/cms/services', 'Services Page', 'cms', 'Website CMS', 123)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.services'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'services',
    'banner',
    '{
      "title": "Our Services",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'service-details',
    'banner',
    '{
      "title": "Service Details",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
