-- Greater Toronto Area — top-level locations
INSERT INTO service_locations (region, name, parent_id, sort_order)
SELECT 'gta', v.name, NULL, v.sort_order
FROM (VALUES
  ('Toronto', 1),
  ('Mississauga', 2),
  ('Brampton', 3),
  ('Vaughan', 4),
  ('Markham', 5),
  ('Richmond Hill', 6),
  ('Oakville', 7),
  ('Burlington', 8),
  ('Milton', 9),
  ('Halton Hills', 10),
  ('Caledon', 11),
  ('Ajax', 12),
  ('Pickering', 13),
  ('Whitby', 14),
  ('Oshawa', 15),
  ('Clarington', 16),
  ('Aurora', 17),
  ('Newmarket', 18),
  ('King City', 19),
  ('Stouffville', 20),
  ('Georgina', 21)
) AS v(name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM service_locations sl
  WHERE sl.region = 'gta' AND sl.name = v.name AND sl.parent_id IS NULL
);

-- Toronto neighbourhoods / boroughs
INSERT INTO service_locations (region, name, parent_id, sort_order)
SELECT 'gta', v.name, p.id, v.sort_order
FROM (VALUES
  ('Downtown Toronto', 1),
  ('North York', 2),
  ('Scarborough', 3),
  ('Etobicoke', 4),
  ('East York', 5),
  ('York', 6)
) AS v(name, sort_order)
JOIN service_locations p ON p.region = 'gta' AND p.name = 'Toronto' AND p.parent_id IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM service_locations sl
  WHERE sl.parent_id = p.id AND sl.name = v.name
);

-- Nearby service areas outside the GTA
INSERT INTO service_locations (region, name, parent_id, sort_order)
SELECT 'nearby', v.name, NULL, v.sort_order
FROM (VALUES
  ('Hamilton', 1),
  ('Stoney Creek', 2),
  ('Ancaster', 3),
  ('Dundas', 4),
  ('Grimsby', 5),
  ('Cambridge', 6),
  ('Kitchener', 7),
  ('Waterloo', 8),
  ('Guelph', 9),
  ('Brantford', 10),
  ('Orangeville', 11),
  ('Barrie', 12),
  ('Innisfil', 13),
  ('Bradford', 14),
  ('Alliston', 15),
  ('Beeton', 16),
  ('Tottenham', 17),
  ('Uxbridge', 18),
  ('Port Perry', 19),
  ('Acton', 20),
  ('Georgetown', 21)
) AS v(name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM service_locations sl
  WHERE sl.region = 'nearby' AND sl.name = v.name AND sl.parent_id IS NULL
);
