INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.projects', '/management/cms/projects', 'Projects Page', 'cms', 'Website CMS', 122)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.projects'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'projects',
    'banner',
    '{
      "title": "Projects",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'project-details',
    'banner',
    '{
      "title": "Project Details",
      "backgroundImage": ""
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;
