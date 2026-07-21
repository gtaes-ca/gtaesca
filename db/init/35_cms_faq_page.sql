CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_is_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON faqs(sort_order);

INSERT INTO admin_pages (key, path, label, group_key, group_label, sort_order) VALUES
  ('management.cms.faq', '/management/cms/faq', 'FAQ Page', 'cms', 'Website CMS', 125)
ON CONFLICT (key) DO NOTHING;

INSERT INTO role_page_access (role, page_key)
SELECT 'admin', 'management.cms.faq'
ON CONFLICT DO NOTHING;

INSERT INTO web_content_widgets (page, section, content) VALUES
  (
    'faq',
    'banner',
    '{
      "title": "FAQ",
      "backgroundImage": ""
    }'::jsonb
  ),
  (
    'faq',
    'settings',
    '{
      "tagline": "FAQ",
      "title": "Frequently Asked Questions",
      "introText": "Find answers to common questions about our electrical services, scheduling, and pricing."
    }'::jsonb
  )
ON CONFLICT (page, section) DO NOTHING;

INSERT INTO faqs (question, answer, sort_order)
SELECT * FROM (VALUES
  (
    'Why is my air conditioner not cooling properly?',
    'Poor cooling is often caused by dirty filters, low refrigerant, blocked vents, or a failing compressor. Schedule a diagnostic visit and we will inspect airflow, electrical connections, and system performance.',
    0
  ),
  (
    'How often should I service my air conditioner?',
    'We recommend professional maintenance at least once per year before peak season. Regular servicing improves efficiency, extends equipment life, and helps prevent costly breakdowns.',
    1
  ),
  (
    'Why is my AC making strange noises?',
    'Buzzing, rattling, or grinding sounds can indicate loose parts, worn bearings, or electrical issues. Turn the unit off and contact us for a safety inspection.',
    2
  ),
  (
    'Do you offer emergency electrical repairs?',
    'Yes. We provide emergency electrical repair services for urgent issues such as power loss, burning smells, sparking outlets, and tripped breakers that will not reset.',
    3
  ),
  (
    'How do I book a service appointment?',
    'You can book online through our website booking page or contact us directly by phone. Choose your service, preferred date, and location to get started.',
    4
  ),
  (
    'Are your technicians licensed and insured?',
    'Yes. Our technicians are licensed, trained, and insured. We follow local codes and safety standards on every job.',
    5
  ),
  (
    'Do you provide upfront pricing?',
    'We provide clear estimates before work begins whenever possible. Final pricing depends on the scope of work, materials required, and any on-site conditions discovered during inspection.',
    6
  ),
  (
    'What areas do you serve?',
    'Service availability depends on your location. Enter your address during booking to confirm coverage in your area.',
    7
  )
) AS seed(question, answer, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM faqs LIMIT 1);
