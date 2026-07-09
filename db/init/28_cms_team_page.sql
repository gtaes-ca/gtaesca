INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.team', '/management/cms/team', 'Team Page', 'cms', 'Website CMS', 121)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.team'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'team',
    'banner',
    '{
      "title": "Our Team",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
