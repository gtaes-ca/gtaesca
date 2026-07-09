INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.about', '/management/cms/about', 'About Us Page', 'cms', 'Website CMS', 120)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.about'
ON CONFLICT DO NOTHING;
