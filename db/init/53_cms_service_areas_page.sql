INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.service-areas', '/management/cms/service-areas', 'Service Areas Page', 'cms', 'Website CMS', 124)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.service-areas'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'service-areas',
    'banner',
    '{
      "title": "Service Areas",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
