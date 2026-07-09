INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms', '/management/cms/homepage', 'Homepage', 'cms', 'Website CMS', 110)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms'
ON CONFLICT DO NOTHING;
