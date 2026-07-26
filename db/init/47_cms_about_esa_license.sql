-- Normalize ESA license number (strip "ESA License(d)" prefix / keep number only)
UPDATE web_content_widgets
SET content = jsonb_set(
  content,
  '{esaLicenseNumber}',
  to_jsonb(
    TRIM(
      BOTH FROM
      REGEXP_REPLACE(
        SPLIT_PART(COALESCE(content->>'esaLicenseNumber', ''), E'\n', 1),
        '(?i)^esa\\s*licen[sc]e[d]?\\s*',
        ''
      )
    )
  ),
  true
)
WHERE page = 'about'
  AND section = 'credentials';

UPDATE web_content_widgets
SET content = jsonb_set(content, '{esaLicenseNumber}', '"#7014495"'::jsonb, true)
WHERE page = 'about'
  AND section = 'credentials'
  AND NULLIF(TRIM(content->>'esaLicenseNumber'), '') IS NULL;
