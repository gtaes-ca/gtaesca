-- Clear placeholder recipient emails so runtime can fall back to SMTP_FROM_EMAIL / SMTP_USER
-- until Admin → CMS → Contact saves a real recipient.
UPDATE web_content_widgets
SET content = jsonb_set(content, '{recipientEmail}', '""'::jsonb, true),
    updated_at = NOW()
WHERE page = 'contact'
  AND section = 'settings'
  AND lower(coalesce(content->>'recipientEmail', '')) IN (
    'example@gamil.com',
    'example@gmail.com'
  );
