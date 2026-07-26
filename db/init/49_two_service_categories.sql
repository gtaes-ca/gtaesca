-- Collapse seed categories to Residential + Commercial only.

INSERT INTO service_categories (name, sort_order) VALUES
  ('Residential Electrical Services', 1),
  ('Commercial Electrical Services', 2)
ON CONFLICT (name) DO NOTHING;

-- Prefer renaming the old home category when the new name is not taken yet.
UPDATE service_categories
SET name = 'Residential Electrical Services', sort_order = 1
WHERE name = 'Home Electrical Services'
  AND NOT EXISTS (
    SELECT 1 FROM service_categories WHERE name = 'Residential Electrical Services'
  );

-- Point former home / smart-home services at Residential.
UPDATE services
SET category_id = (
  SELECT id FROM service_categories WHERE name = 'Residential Electrical Services' LIMIT 1
)
WHERE category_id IN (
  SELECT id FROM service_categories
  WHERE name IN ('Home Electrical Services', 'Smart Home Installations')
);

-- Ensure Commercial sort order.
UPDATE service_categories
SET sort_order = 2
WHERE name = 'Commercial Electrical Services';

UPDATE service_categories
SET sort_order = 1
WHERE name = 'Residential Electrical Services';

-- Remove obsolete seed categories (safe once services are reassigned).
DELETE FROM service_categories
WHERE name IN ('Home Electrical Services', 'Smart Home Installations');
