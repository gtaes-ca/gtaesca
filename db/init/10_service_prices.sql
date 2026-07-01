ALTER TABLE services
  ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS service_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (service_price >= 0);

UPDATE services SET price = 175.00
WHERE name IN ('Smoke & Carbon Monoxide Alarms', 'Sockets, Outlets & Switches');

UPDATE services SET price = 225.00
WHERE name IN (
  'Electrical Troubleshooting & Repairs',
  'Ceiling Fan & Fixture Installation',
  'Dedicated Circuits',
  'Electrical Maintenance Calls',
  'Troubleshooting & Repairs'
);

UPDATE services SET price = 395.00
WHERE name IN (
  'Indoor & Outdoor Lighting',
  'Enhanced Home Safety Installations',
  'Smart Home Installations',
  'Commercial Lighting',
  'Emergency Lighting'
);

UPDATE services SET price = 895.00
WHERE name IN (
  'EV Charger Installation',
  'Transformer Installation & Service',
  'Parking Lot Lighting',
  'Panel & Service Upgrades'
);

UPDATE services SET price = 1450.00
WHERE name IN (
  'Generator Installation',
  'Renovation & Addition Wiring',
  'Tenant Improvement Wiring',
  'Dedicated Circuits & Equipment Wiring'
);

UPDATE services SET price = 2200.00
WHERE name IN (
  'Panel Upgrades & Installation',
  'Basement Wiring',
  'Home Rewiring',
  'Custom Home Wiring',
  'New Commercial Rough-Ins'
);
