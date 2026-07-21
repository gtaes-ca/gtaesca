CREATE OR REPLACE FUNCTION slugify_text(input text) RETURNS text AS $$
BEGIN
  RETURN trim(both '-' from regexp_replace(
    regexp_replace(lower(trim(coalesce(input, ''))), '[^a-z0-9\s-]', '', 'g'),
    '\s+',
    '-',
    'g'
  ));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(220);

UPDATE services
SET slug = coalesce(nullif(slugify_text(name), ''), 'service-' || id::text)
WHERE slug IS NULL OR slug = '';

WITH ranked AS (
  SELECT id, slug, row_number() OVER (PARTITION BY slug ORDER BY id) AS rn
  FROM services
)
UPDATE services s
SET slug = CASE
  WHEN r.rn = 1 THEN r.slug
  ELSE r.slug || '-' || r.rn
END
FROM ranked r
WHERE s.id = r.id AND r.rn > 1;

UPDATE services
SET slug = 'service-' || id::text
WHERE slug IS NULL OR slug = '';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'services'
      AND column_name = 'slug'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE services ALTER COLUMN slug SET NOT NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
