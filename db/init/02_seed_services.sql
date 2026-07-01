INSERT INTO service_categories (name, sort_order) VALUES
  ('Home Electrical Services', 1),
  ('Smart Home Installations', 2),
  ('Commercial Electrical Services', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO services (category_id, name, description, sort_order)
SELECT c.id, s.name, s.description, s.sort_order
FROM (VALUES
  ('Home Electrical Services', 'Smoke & Carbon Monoxide Alarms', 'Installation, replacement, and upgrades for smoke detectors and carbon monoxide alarms.', 1),
  ('Home Electrical Services', 'EV Charger Installation', 'Professional installation of Level 2 electric vehicle chargers for convenient at-home charging.', 2),
  ('Home Electrical Services', 'Electrical Troubleshooting & Repairs', 'Diagnosing and fixing flickering lights, tripping breakers, faulty outlets, and wiring problems.', 3),
  ('Home Electrical Services', 'Panel Upgrades & Installation', 'Electrical panel upgrades, replacements, and new installations.', 4),
  ('Home Electrical Services', 'Indoor & Outdoor Lighting', 'Pot lights, chandeliers, security lighting, landscape lighting, and exterior fixtures.', 5),
  ('Home Electrical Services', 'Sockets, Outlets & Switches', 'Installation and repair of outlets, switches, dimmers, smart switches, and GFCI outlets.', 6),
  ('Home Electrical Services', 'Basement Wiring', 'Complete electrical wiring for finished basements with code-compliant installations.', 7),
  ('Home Electrical Services', 'Home Rewiring', 'Partial and full-home rewiring to replace outdated or damaged electrical systems.', 8),
  ('Home Electrical Services', 'Custom Home Wiring', 'Complete wiring solutions for custom homes, new builds, renovations, and additions.', 9),
  ('Home Electrical Services', 'Enhanced Home Safety Installations', 'Surge protection, GFCI/AFCI protection, grounding improvements, and code compliance updates.', 10),
  ('Home Electrical Services', 'Generator Installation', 'Installation of backup generators and transfer switches for outage protection.', 11),
  ('Home Electrical Services', 'Renovation & Addition Wiring', 'Electrical wiring for kitchens, bathrooms, additions, garages, and renovations.', 12),
  ('Smart Home Installations', 'Smart Home Installations', 'Smart lighting, thermostats, home automation devices, and electric baseboard heaters.', 1),
  ('Smart Home Installations', 'Ceiling Fan & Fixture Installation', 'Installation and replacement of ceiling fans, bathroom fans, and light fixtures.', 2),
  ('Smart Home Installations', 'Dedicated Circuits', 'Dedicated circuits for appliances, EV chargers, hot tubs, HVAC units, and high-power equipment.', 3),
  ('Commercial Electrical Services', 'New Commercial Rough-Ins', 'Complete electrical rough-ins for new commercial builds and tenant improvements.', 1),
  ('Commercial Electrical Services', 'Transformer Installation & Service', 'Installation, replacement, and servicing of commercial transformers.', 2),
  ('Commercial Electrical Services', 'Commercial Lighting', 'Office, retail, warehouse, LED, and interior/exterior commercial lighting.', 3),
  ('Commercial Electrical Services', 'Parking Lot Lighting', 'Installation, repair, and maintenance of parking lot and pole lights.', 4),
  ('Commercial Electrical Services', 'Electrical Maintenance Calls', 'Ongoing electrical maintenance, service calls, troubleshooting, and repairs.', 5),
  ('Commercial Electrical Services', 'Emergency Lighting', 'Installation, testing, repair, and replacement of emergency lights and exit signs.', 6),
  ('Commercial Electrical Services', 'Panel & Service Upgrades', 'Commercial panel upgrades, subpanels, and service upgrades.', 7),
  ('Commercial Electrical Services', 'Troubleshooting & Repairs', 'Diagnosis and repair of commercial power loss, breaker trips, and circuit issues.', 8),
  ('Commercial Electrical Services', 'Tenant Improvement Wiring', 'Electrical wiring for office build-outs, retail spaces, restaurants, and warehouses.', 9),
  ('Commercial Electrical Services', 'Dedicated Circuits & Equipment Wiring', 'Power installations for commercial equipment, machinery, HVAC, and appliances.', 10)
) AS s(category_name, name, description, sort_order)
JOIN service_categories c ON c.name = s.category_name
ON CONFLICT (category_id, name) DO NOTHING;
