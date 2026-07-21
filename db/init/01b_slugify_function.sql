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
