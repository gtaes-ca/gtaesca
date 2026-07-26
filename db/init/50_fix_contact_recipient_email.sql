-- Clear placeholder contact recipient so quote emails are not lost.
UPDATE web_content_widgets
SET content = jsonb_set(
  content,
  '{recipientEmail}',
  '""'::jsonb,
  true
)
WHERE page = 'contact'
  AND section = 'settings'
  AND lower(coalesce(content->>'recipientEmail', '')) IN (
    'example@gamil.com',
    'example@gmail.com'
  );

-- Prefer topbar email when recipient is empty.
UPDATE web_content_widgets AS contact
SET content = jsonb_set(
  contact.content,
  '{recipientEmail}',
  to_jsonb(coalesce(topbar.content->>'email', '')),
  true
)
FROM web_content_widgets AS topbar
WHERE contact.page = 'contact'
  AND contact.section = 'settings'
  AND topbar.page = 'home'
  AND topbar.section = 'topbar'
  AND coalesce(nullif(trim(contact.content->>'recipientEmail'), ''), '') = ''
  AND coalesce(nullif(trim(topbar.content->>'email'), ''), '') <> ''
  AND lower(trim(topbar.content->>'email')) NOT IN (
    'example@gamil.com',
    'example@gmail.com'
  );
