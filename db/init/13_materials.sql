CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  unit VARCHAR(30) NOT NULL DEFAULT 'each',
  default_unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (default_unit_price >= 0),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_is_active ON materials(is_active);
CREATE INDEX IF NOT EXISTS idx_materials_name ON materials(name);

CREATE TABLE IF NOT EXISTS service_material_defaults (
  service_id INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  material_id INT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  default_quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (default_quantity > 0),
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (service_id, material_id)
);

CREATE TABLE IF NOT EXISTS booking_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  material_id INT REFERENCES materials(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  unit VARCHAR(30) NOT NULL DEFAULT 'each',
  quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  notes TEXT,
  added_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_materials_booking_id ON booking_materials(booking_id);

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS materials_total NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (materials_total >= 0),
  ADD COLUMN IF NOT EXISTS total_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0);

UPDATE bookings
SET materials_total = 0,
    total_price = service_price
WHERE total_price = 0 OR total_price IS NULL;

INSERT INTO materials (name, unit, default_unit_price, description) VALUES
  ('12/2 Copper Wire', 'ft', 3.50, 'NM-B 12/2 copper wire'),
  ('14/2 Copper Wire', 'ft', 2.75, 'NM-B 14/2 copper wire'),
  ('GFCI Outlet', 'each', 28.00, 'Ground fault circuit interrupter outlet'),
  ('Standard Outlet', 'each', 8.50, 'Duplex receptacle'),
  ('Light Switch', 'each', 6.00, 'Single-pole switch'),
  ('Dimmer Switch', 'each', 22.00, 'LED-compatible dimmer'),
  ('Wire Nuts (pack)', 'pack', 4.50, 'Assorted wire connectors'),
  ('Electrical Tape', 'roll', 3.25, 'Standard vinyl electrical tape'),
  ('Junction Box', 'each', 5.75, '4-inch square junction box'),
  ('Breaker 15A', 'each', 12.00, 'Single-pole 15 amp breaker'),
  ('Breaker 20A', 'each', 14.00, 'Single-pole 20 amp breaker'),
  ('Ceiling Fan Mounting Kit', 'each', 18.00, 'Fan brace and mounting hardware'),
  ('Conduit Fittings', 'each', 4.00, 'EMT connectors and couplings'),
  ('Smoke Detector', 'each', 35.00, 'Hardwired smoke alarm'),
  ('CO Detector', 'each', 42.00, 'Carbon monoxide detector')
ON CONFLICT (name) DO NOTHING;
